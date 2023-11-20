const express = require('express');
const router = express.Router();
const groupDB = require('../database_tools/group_db'); // Import the correct file

// Endpoint to create a new group
router.post('/create', async (req, res) => {
  try {
    console.log('Received POST request to /groups/create');// Console log
    console.log('Request Body:', req.body); // Add this line for debugging
    const groupName = req.body.groupName;
    const ownerId = req.body.ownerId;
    const description = req.body.description;
    const settingsJson = req.body.settingsJson;
    const groupId = req.body.groupId;

    console.log('Extracted Values:', groupName, ownerId, description, settingsJson, groupId);

    // Check if the group already exists by name
    const groupExists = await groupDB.groupExists(groupName);
    if (groupExists) {
      return res.status(400).json({ message: 'Group with the same name already exists' });
    }

    // Add the new group
    const createdGroup = await groupDB.addGroup(groupName, description, settingsJson, ownerId);

    //Console log the created groups information.
    console.log('Created Group Information:', createdGroup[0]);

    // Send a success response with the created group
    res.status(201).json({ message: 'Group created successfully', group: createdGroup[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to get all groups
router.get('/all', async (req, res) => {
  try {
    console.log('Received GET request to /groups/all');
    const groups = await groupDB.getAllGroups();
    res.status(200).json({ message: 'All groups retrieved successfully', groups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to update groups.
router.put('/update/:id', async (req, res) => {
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
    console.log('Received DELETE request to /groups/delete');
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

module.exports = router;
