const express = require('express');
const router = express.Router();
const pgPool = require('../database_tools/connection'); 
const groupDB = require('../database_tools/group_db');
const userDB = require('../database_tools/user.js');
const { getUserByID } = userDB;
const jwt = require('jsonwebtoken');

// Parse application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }));
// Used to parse the json data that houses the group settings
router.use(express.json());

// Function to get the session token
function getSessionToken(req) {
  const t = req.session.token;
  return t === null || t === 'null' ? '' : t;
}

// Simple endpoint for testing
router.get('/test', (req, res) => {
    res.status(200).json({ message: 'Test endpoint reached successfully' });
  });


// Function to add a new member to a group, if the member already exists this rollsback the transaction
async function addMember(groupId, userId, acceptedPool) {
    let client;
    try {

      client = await pgPool.connect();
      await client.query('BEGIN');
  
      const result = await client.query('INSERT INTO members (idgroup, iduser, status) VALUES ($1, $2, $3) RETURNING *', [groupId, userId, acceptedPool]);
      const memberId = result.rows[0].iduser;
  
      const memberExists = await memberExistsById(groupId, memberId);
  
      if (memberExists) {
        console.log(`Member with userId ${userId} already exists in the group.`);
        await client.query('ROLLBACK');
        return { memberExists: true };
      } else {
        await client.query('COMMIT');
        return { ...result.rows[0], memberExists: false };
      }
    } catch (error) {
      if (client) {
        await client.query('ROLLBACK');
      }
      console.error('Error in addMember:', error);
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

// Endpoint to add a new member to a group
router.post('/:groupId/add-member', async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.body.userId;

    // Add the new member to the group with acceptedPool set to 'FALSE'
    const addedMember = await groupDB.addMember(groupId, userId, 'FALSE');

    // Send a success response with the added member
    res.status(201).json({ message: 'Member added successfully', member: addedMember });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to update a member's status in a group
router.put('/:groupId/update-member/:userId', async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.params.userId;
    const acceptedPool = req.body.acceptedPool || 'TRUE'; // Assuming TRUE is the default

    // Update the member's status
    const updateResult = await groupDB.updateMemberStatus(groupId, userId, acceptedPool);

    if (updateResult.memberUpdated) {
      res.status(200).json({ message: 'Member status updated successfully', result: updateResult.result });
    } else {
      res.status(404).json({ message: 'Member not found or not updated' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Endpoint to get all members of a group with TRUE
router.get('/:groupId/get', async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const acceptedMembers = await groupDB.getMembers(groupId);

    const usernamePromises2 = acceptedMembers.map(async (member) => {
      const userData = await getUserByID(member.iduser);
      return { ...member, username: userData[0].username || 'N/A' };
    });

    const acceptedMembersWithUsernames = await Promise.all(usernamePromises2);

    res.status(200).json({ acceptedMembers: acceptedMembersWithUsernames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to get all members of a group with FALSE, including usernames
router.get('/:groupId/pending-members-with-usernames', async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const pendingMembers = await groupDB.getPendingMembers(groupId);

    const usernamePromises = pendingMembers.map(async (member) => {
      const userData = await getUserByID(member.iduser);
      return { ...member, username: userData[0].username || 'N/A' };
    });

    const pendingMembersWithUsernames = await Promise.all(usernamePromises);

    res.status(200).json({ pendingMembers: pendingMembersWithUsernames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to delete a member from a group
router.delete('/:groupId/members/:memberId', /*checkLoggedIn, checkGroupOwnership,*/ async (req, res) => {
  try {
    console.log('Received DELETE request to /groups/:groupId/members/:memberId');
    const groupId = req.params.groupId;
    const memberId = req.params.memberId;

    // Database logic
    const result = await groupDB.deleteMemberById(groupId, memberId);

    // Send the delete result as a response
    res.status(200).json({ message: 'Member deleted successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
