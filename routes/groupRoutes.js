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
    const groupsettings = req.body.groupsettings ? JSON.parse(req.body.groupsettings) : null;
    const groupId = req.body.groupId;

    // Check if the group already exists by name
    const groupExists = await groupDB.groupExists(groupName);
    if (groupExists) {
      return res.status(400).json({ message: 'Group with the same name already exists' });
    }
    client = await pgPool.connect();
    await client.query('BEGIN');

    // Add the new group
    const createdGroup = await groupDB.addGroup(groupName, description, groupsettings, ownerId);

    // Add the owner as a member and set them as the owner
    const addMemberResult = await groupDB.addMember(createdGroup.id, ownerId, true);
    await client.query('COMMIT');
    const updatedGroups = await groupDB.getAllGroups();
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
router.put('/update/:id', checkGroupOwnership, async (req, res) => {
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

// Get groups names and settings by user id
router.get('/groupByUser/:userId', async (req, res) => {
  try {
    const data = await groupDB.getGroubsByUser(req.params.userId);
    const result = data.rows;
    console.log(result);
    res.status(200).json({ message: 'Groups retrieved successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Updates group settings by group name
router.put('/groupSettingsUpdate/', async (req, res) => {
  try {
    console.log("Reached this far");
    const groupName = req.body.groupName;
    const settings = req.body.settings;
    console.log(settings);
    // Update the group
    const updatedGroup = await groupDB.updateGroupSettingsByName(settings, groupName);

    // Check if the update was successful
    if (updatedGroup.length > 0) {
      // Send a success response
      res.status(200).json({ message: 'Group updated successfully', group: updatedGroup[0] });
    } else {
      res.status(500).json({ message: 'Failed to update group' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Get group by name.

router.get('/groupByName/:groupName', async (req, res) => {
  try {
    const data = await groupDB.getGroupByName(req.params.groupName);
    console.log(data);
    res.status(200).json({ message: 'Group retrieved successfully', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
module.exports = router;
