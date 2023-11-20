const pgPool = require('./connection');

// SQL commands for group operations
const sql = {
  INSERT_GROUP: 'INSERT INTO groups (groupname, groupdescription, groupsettings, idowner) VALUES ($1, $2, $3, $4) RETURNING *',
  GET_GROUPS: 'SELECT idgroup, groupname, groupdescription, groupsettings, idowner FROM groups',
  GET_GROUP_BY_NAME: 'SELECT idgroup, groupname, groupdescription, groupsettings, idowner FROM groups WHERE groupname=$1',
  UPDATE_GROUP: 'UPDATE groups SET groupname=$1, groupdescription=$2, groupsettings=$3 WHERE idgroup=$4 RETURNING *',
  DELETE_GROUP: 'DELETE FROM groups WHERE idgroup=$1 RETURNING *',
  GROUP_EXISTS: 'SELECT 1 FROM groups WHERE groupname=$1 LIMIT 1'
};

// Function to add a new group to the database
async function addGroup(groupname, groupdescription, groupsettings, idowner) {
    console.log('Adding group with the following details:');
    console.log('groupname:', groupname);
    console.log('groupdescription:', groupdescription);
    console.log('groupsettings:', groupsettings);
    console.log('idowner:', idowner);
    
       try {
          const result = await pgPool.query(sql.INSERT_GROUP, [groupname, groupdescription, groupsettings, idowner]);
          return result.rows; // Return the newly created group
      } catch (error) {
         console.error(error);
         throw error;
     }
     }
  

// Function to retrieve all groups from the database
async function getAllGroups() {
  const result = await pgPool.query(sql.GET_GROUPS);
  return result.rows;
}

// Function to get a group by name
async function getGroupByName(groupname) {
  const result = await pgPool.query(sql.GET_GROUP_BY_NAME, [groupname]);
  return result.rows;
}

// Function to update a group by ID
async function updateGroupById(groupname, groupdescription, groupsettings, idgroup) {
  const result = await pgPool.query(sql.UPDATE_GROUP, [groupname, groupdescription, groupsettings, idgroup]);
  return result.rows;
}

// Function to delete a group by ID
async function deleteGroupById(idgroup) {
  const result = await pgPool.query(sql.DELETE_GROUP, [idgroup]);
  return result.rows;
}

// Function to check if a group exists by name
async function groupExists(groupname) {
  const result = await pgPool.query(sql.GROUP_EXISTS, [groupname]);
  return result.rows.length > 0;
}

// Function to check if a group exists by ID
async function groupExistsById(idgroup) {
  const result = await pgPool.query('SELECT 1 FROM groups WHERE idgroup=$1 LIMIT 1', [idgroup]);
  return result.rows.length > 0;
}

module.exports = {
  addGroup,
  getAllGroups,
  getGroupByName,
  updateGroupById,
  deleteGroupById,
  groupExists,
  groupExistsById
};
