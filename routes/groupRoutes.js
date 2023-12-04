const express = require('express');
const router = express.Router();
const pgPool = require('../database_tools/connection'); 
const groupDB = require('../database_tools/group_db');
const jwt = require('jsonwebtoken');
const { getUserByName } = require('../database_tools/user');

// Parse application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }));

// Used to parse the json data that houses the group settings
router.use(express.json());

// Function to get the session token
function getSessionToken(req) {
  const t = req.session.token;
  return t === null || t === 'null' ? '' : t;
}
/*
const checkLoggedIn = async (req, res, next) => {
  const { username } = req.body;
  const sessionToken = req.session.token;

  try {
    if (username && sessionToken) {
      // If both username and session token are present
      req.headers.authorization = `Bearer ${sessionToken}`;
      return next();
    } else {
      return res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

*/
// Middleware to check if the logged-in user is the owner of the group
const checkGroupOwnership = async (req, res, next) => {
  const groupId = req.params.id;
  const username = req.body.ownerId;

  try {
    // Check if the user is the owner of the group
    const isOwner = await groupDB.isGroupOwner(groupId, username);
    if (isOwner) {
      next();
    } else {
      res.status(403).json({ message: 'Permission denied: You are not the owner of this group' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Endpoint to create a new group
router.post('/create', async (req, res) => {
  let client;
  try {

    // Extract data from the request body
    const groupName = req.body.groupName;
    const ownerId = req.body.idowner;
    const description = req.body.description;

    const groupSettingsString = req.body.groupsettings;
    console.log('groupName:', groupName);
    console.log('description:', description);
    console.log('groupSettingsString:', groupSettingsString);

    const groupsettings = req.body.groupsettings ? JSON.parse(req.body.groupsettings ) : null;
    const groupId = req.body.groupId;

    // Check if the group already exists by name
    const groupExists = await groupDB.groupExists(groupName);
    if (groupExists) {
      return res.status(400).json({ message: 'Group with the same name already exists' });
    }

    // Use a transaction to ensure that both group creation and member addition are atomic
    client = await pgPool.connect();
    await client.query('BEGIN');

    // Add the new group
    const createdGroup = await groupDB.addGroup(groupName, description, groupsettings, ownerId);

    // Add the owner as a member and set them as the owner
    console.log('Status being passed:', true);
    const addMemberResult = await groupDB.addMember(createdGroup.id, ownerId, true);
   /* if (addMemberResult.memberExists) {
      // Handle the case where the user is already a member
      // You can decide whether to return an error or handle it differently
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'User is already a member of the group' });
    }*/

    // Commit the transaction
    await client.query('COMMIT');

    // Fetch the updated list of groups
    const updatedGroups = await groupDB.getAllGroups();

    // Send a success response with the created group and the updated list of groups
    res.status(201).json({ message: 'Group created successfully', group: createdGroup[0], groups: updatedGroups });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (client) {
      client.release();
    }
  }
});



// Endpoint to get all groups.
router.get('/all/:id?', async (req, res) => {
  try {
    const groupId = req.params.id;

    if (groupId) {
      // If groupId is provided, fetch the single group by ID
      const group = await groupDB.getGroupById(groupId);

      if (!group || group.length === 0) {
        return res.status(404).json({ message: 'Group not found' });
      }

      res.status(200).json({ message: 'Group retrieved successfully', group: group[0] });
    } else {
      // If no groupId is provided, fetch all groups
      const groups = await groupDB.getAllGroups();
      res.status(200).json({ message: 'All groups retrieved successfully', groups });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to get groups by id.
router.get('/:id', async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await groupDB.getGroupById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json({ message: 'Group retrieved successfully', group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to update groups.
router.put('/update/:id', /*checkLoggedIn,*/ checkGroupOwnership, async (req, res) => {
  try {
    const groupId = req.params.id;
    const { groupName, description, settingsJson } = req.body;

    // Check if the group exists by ID
    const groupExists = await groupDB.groupExistsById(groupId);
    if (!groupExists) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Update the group
    const updatedGroup = await groupDB.updateGroupById(groupName, description, settingsJson, groupId);

    // Check if the update was successful
    if (updatedGroup.length > 0) {
      // Send a success response
      res.status(200).json({ message: 'Group updated successfully', group: updatedGroup[0] });
    } else {
      res.status(500).json({ message: 'Failed to update group' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to delete a group by ID
router.delete('/delete/:Id', async (req, res) => {
  try {
    const groupId = req.params.Id;

    // Database logic
    const result = await groupDB.deleteGroupById(groupId);

    // Send the delete result as a response
    res.status(200).json({ message: 'Group deleted successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to add a new member to a group
router.post('/:groupId/add-member', async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.body.userId;

    // Add the new member to the group with acceptedPool set to 'FALSE'
    const addedMember = await groupDB.sendJoinRequest(groupId, userId, 'FALSE');

    // Send a success response with the added member
    res.status(201).json({ message: 'Member added successfully', member: addedMember });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
