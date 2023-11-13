//I will delete this when i deem it is no longer needed -Huhroo
const express = require('express');
const pgPool = require('../database_tools/connection'); 
const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const result = await pgPool.query('SELECT * FROM webUsers');
    res.json(result.rows);
  } catch (error) {
    console.error('Error querying the database', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;