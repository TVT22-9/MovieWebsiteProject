const pgPool = require('./connection');

// SQL commands for group operations
const sql = {
  INSERT_GROUP: 'INSERT INTO groups (groupname, groupdescription, groupsettings, idowner) VALUES ($1, $2, $3, $4) RETURNING *',
  GET_GROUPS: 'SELECT idgroup, groupname, groupdescription, groupsettings, idowner FROM groups',
  GET_GROUP_BY_NAME: 'SELECT idgroup, groupname, groupdescription, groupsettings, idowner FROM groups WHERE groupname=$1',
  UPDATE_GROUP: 'UPDATE groups SET groupname=$1, groupdescription=$2, groupsettings=$3 WHERE idgroup=$4 RETURNING *',
  DELETE_GROUP: 'DELETE FROM groups WHERE idgroup=$1 RETURNING *',
  GROUP_EXISTS: 'SELECT 1 FROM groups WHERE groupname=$1 LIMIT 1',
  GROUP_EXISTS_BY_ID: 'SELECT 1 FROM groups WHERE idgroup=$1 LIMIT 1',
  GET_GROUP_BY_ID: 'SELECT idgroup, groupname, groupdescription, groupsettings, idowner FROM groups WHERE idgroup=$1',

// SQL commands for member operations
  SELECT_COUNT_BY_USERNAME: 'SELECT COUNT(*) FROM members WHERE idgroup = $1 AND username = $2',
  INSERT_INTO: 'INSERT INTO members (idgroup, iduser, status) VALUES ($1, $2, $3)',
  SELECT_ALL_BY_idgroup: 'SELECT * FROM members WHERE idgroup = $1',
  SELECT_COUNT_BY_ID: 'SELECT COUNT(*) FROM members WHERE idgroup = $1 AND iduser = $2',
  UPDATE_BY_ID: 'UPDATE members SET role = $1 WHERE idgroup = $2 AND iduser = $3',
  DELETE_BY_ID: 'DELETE FROM members WHERE idgroup = $1 AND iduser = $2',
  GET_MEMBERS_BY_GROUP: 'SELECT * FROM members WHERE groupId = $1 AND acceptedPool = $2'
};


              //Group related functions

// Function to add a new group to the database
async function addGroup(groupname, groupdescription, groupsettings, idowner) {
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

// Function to get a group by ID
async function getGroupById(idgroup) {
  const result = await pgPool.query(sql.GET_GROUP_BY_ID, [idgroup]);
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

        //Member related functions


async function addMember(idgroup, iduser, status){
  //console.log('Adding member:', idgroup, iduser, status);
  await pgPool.query(sql.INSERT_INTO, [idgroup, iduser, status]);
}

// Function to send join requests
async function sendJoinRequest(groupId, userId, acceptedPool) {
  try {
    const joinRequestExists = await checkJoinRequestExists(groupId, userId);

    if (joinRequestExists) {
      return { joinRequestExists: true };
    }

    // Add the user as a member with acceptedPool set to false
    const addMemberResult = await addMember(groupId, userId, acceptedPool);

    //if (addMemberResult.memberExists) {
    //}

    // Notify the other component about the join request
    // You can use an event emitter or another mechanism to notify the other component
    const updatedMembers = await getMembers(groupId);

    return { joinRequestSent: true, result: addMemberResult, updatedMembers };  } catch (error) {
    console.error('Error in sendJoinRequest:', error);
    throw error;
  }
}



// Function to check if a join request exists for a user and group
async function checkJoinRequestExists(groupId, userId) {
  const result = await pgPool.query('SELECT COUNT(*) FROM members WHERE idgroup = $1 AND iduser = $2', [groupId, userId]);
  return result.rows[0].count > 0;
}

// Function to check if a member exists in a group
async function memberExists(groupId, username, acceptedPool) {
  const result = await pgPool.query('SELECT COUNT(*) FROM members WHERE idgroup = $1 AND iduser = $2 AND status = $3', [groupId, username, acceptedPool]);
  return result.rows[0].count > 0;
}

// Function to update a member's status in a group
async function updateMemberStatus(groupId, userId, newStatus) {
  try {
    // Check if the member exists
    const existingMember = await pgPool.query('SELECT * FROM members WHERE idgroup = $1 AND iduser = $2', [groupId, userId]);

    if (existingMember.rows.length > 0) {
      const currentStatus = existingMember.rows[0].status;

      // If the member exists, update the status based on the new status
      const updateResult = await pgPool.query('UPDATE members SET status = $1 WHERE idgroup = $2 AND iduser = $3 RETURNING *', [newStatus, groupId, userId]);

      // Check if the member was successfully updated
      if (updateResult.rows.length > 0) {
        const updatedMembers = await getMembers(groupId);
        return { memberUpdated: true, result: updateResult.rows[0], updatedMembers };
      } else {
        return { memberUpdated: false };
      }
    } else {
      // If the member doesn't exist, return an error or handle as needed
      return { memberUpdated: false, error: 'Member not found' };
    }
  } catch (error) {
    console.error('Error in updateMemberStatus:', error);
    throw error;
  }
}


// Function to get all members of a group who are waiting to be accepted
async function getPendingMembers(groupId) {
  try {
    const query = 'SELECT * FROM members WHERE idgroup = $1 AND status = $2';
    const values = [groupId, false];

    const { rows } = await pgPool.query(query, values);
    return rows;
  } catch (error) {
    throw error;
  }
}


// Function to get all accepted members of a group
async function getMembers(groupId) {
  try {
    const query = 'SELECT * FROM members WHERE idgroup = $1 AND status = $2';
    const values = [groupId, true];

    const { rows } = await pgPool.query(query, values);
    return rows;
  } catch (error) {
    throw error;
  };
}

// Function to check if a member exists in a group by member ID and group ID
async function memberExistsById(groupId, memberId) {
  const result = await pgPool.query('SELECT COUNT(*) FROM members WHERE idgroup = $1 AND iduser = $2', [groupId, memberId]);
  return result.rows[0].count > 0;
}

// Function to delete a member from a group
async function deleteMemberById(groupId, memberId) {
  const result = await pgPool.query('DELETE FROM members WHERE idgroup = $1 AND iduser = $2 RETURNING *', [groupId, memberId]);
  return result.rows.length > 0;
}

// Function to delete all members of a group
async function deleteAllMembers(groupId) {
  const result = await pgPool.query('DELETE FROM members WHERE idgroup = $1 RETURNING *', [groupId]);
  return result.rows;
}


module.exports = {
  addGroup,
  getAllGroups,
  getGroupByName,
  getGroupById,
  updateGroupById,
  deleteGroupById,
  groupExists,
  groupExistsById,
  sendJoinRequest,
  addMember,
  memberExists,
  updateMemberStatus,
  getMembers,
  getPendingMembers,
  memberExistsById,
  deleteMemberById,
  deleteAllMembers
};
