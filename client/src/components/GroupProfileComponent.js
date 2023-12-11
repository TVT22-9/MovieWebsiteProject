import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {  userData } from "./Signals";
import '../group.css';
import NewsComponent from './NewsComponent';
//Component for group profiles where non members are restrictedfrom browsing the page.
//Here the group owner can accept join requests from other users.

const GroupProfileComponent = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [acceptedMembers, setacceptedMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch group details based on groupId
    axios.get(`http://localhost:3001/groups/${groupId}`)
      .then(response => {

      // Check if the response has a group property and is an array
      if (Array.isArray(response.data.group) && response.data.group.length > 0) {
        // Update the state with the first group in the array
        setGroup(response.data.group[0]);
      } else {
        // If the structure is not as expected, set group to null
        setGroup(null);
      }
      
        setGroup(response.data.group || null);
        console.log(response.data.group)
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => console.error('Error fetching group members:', error))
      .then(() => setLoading(false))
      .catch(error => console.error('Error setting loading state:', error));

  // Fetch all members of the group with TRUE
  axios.get(`http://localhost:3001/members/${groupId}/get`)
  .then(response => {
    setacceptedMembers(response.data.acceptedMembers || []);
  })
  .catch(error => console.error('Error fetching group members:', error))
  .finally(() => setLoading(false));

  // Fetch pending members of the group with usernames
  axios.get(`http://localhost:3001/members/${groupId}/pending-members-with-usernames`)
  .then(response => {
    // Use the callback form of setPendingMembers to get the updated state value
    setPendingMembers(prevPendingMembers => response.data.pendingMembers || []);
  })
  .catch(error => console.error('Error fetching pending group members with usernames:', error));

  fetchAcceptedMembers();
}, [groupId]);

  

//Uses a signal to check if the user is on the member table for the group they're browsing.
const isUserMember = acceptedMembers.some(member => member.username === userData.value?.private);

//Gets the list of user that have sent join requests but haven't been accepted.
const getPendingMembers = async (groupId) => {
  try {
    const response = await axios.get(`http://localhost:3001/members/${groupId}/pending-members`);
    return response.data.pendingMembers || [];
  } catch (error) {
    console.error('Error fetching pending group members:', error);
    throw error;
  }
};

//Accepts a user in to the group
const handleAcceptPendingMember = async (userId) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/members/${groupId}/update-member/${userId}`,
      {
        acceptedPool: true,
      }
    );

    axios.get(`http://localhost:3001/groups/${groupId}`)
      .then(response => {
        setGroup(response.data.group || null);
      })
      .catch(error => console.error('Error fetching group details:', error));

    axios.get(`http://localhost:3001/members/${groupId}/get`)
      .then(response => {
        setacceptedMembers(response.data.acceptedMembers || []);
      })
      .catch(error => console.error('Error fetching group members:', error));
      setPendingMembers(prevPendingMembers =>
        prevPendingMembers.filter(member => member.iduser !== userId)
      );
    } catch (error) {
      console.error('Error accepting join request:', error.response || error);
    }
  };

//Gets the list of accepted members for a group.
const fetchAcceptedMembers = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/members/${groupId}/get`);

    // Use the callback form of setMembers to get the updated state value
    setacceptedMembers(prevMembers => response.data.acceptedMembers || []);
  } catch (error) {
    console.error('Error fetching accepted group members:', error);
  }
};
    
//Deletes a member, used for both pending and accepted members.
const handleDeleteMember = async (groupId, memberId, setacceptedMembers) => {
  try {
    if (memberId) {
      // Regular delete for a single member
      const response = await axios.delete(`http://localhost:3001/members/${groupId}/members/${memberId}`);
      
      // Update the members state by removing the deleted member
      setacceptedMembers(prevMembers => prevMembers.filter(member => member.iduser !== memberId));

    } else {
      // Delete all members of the group
      const deleteAllMembersResponse = await axios.delete(`http://localhost:3001/members/${groupId}/delete-all-members`);
      
      // Assuming the response contains deleted members, update the state accordingly
      setacceptedMembers([]);
    }
  } catch (error) {
    console.error('Error deleting members:', error);
  }
};

//Deletes all the members of a group and then the group itself.
const handleDeleteGroup = async (groupId, setGroups) => {
  try {
    const id = parseInt(groupId, 10);

    // Delete all members of the group
    await handleDeleteMember(groupId, null, setGroups);

    // Now that members are deleted, delete the group itself
    const response = await axios.delete(`http://localhost:3001/groups/delete/${id}`);

    // Update the groups state by removing the deleted group
    setGroups(prevGroups => prevGroups.filter(group => group.idgroup !== id));

  } catch (error) {
    console.error('Error deleting group:', error);
  }
};
function GetNewsForGroup() {
    
    console.log(group[0].groupsettings.news)
    return (
      <div>
        {group[0].groupsettings.news.flat().map((title, index) => <NewsComponent key={index} filterTitle={title} returnMany={false} />)} 

      </div>
    )
  }

 return (
  <div>
    {group && isUserMember && (
      <div>
        <h2 className="group-header">Group Profile</h2>
        <p  className="group-container">
          Group Name: <strong>{group.length > 0 && group[0].groupname}</strong>
          {userData.value && userData.value.userid === group[0].idowner && (
            <button className="groupRelated-button" onClick={() => handleDeleteGroup(group[0].idgroup, setGroups)}>Delete Group</button>
          )}
        </p>
        <p  className="group-container">
          Description: <strong>{group.length > 0 && group[0].groupdescription}</strong></p>
        <p  className="group-container">
          Here would be news etc added by users:</p>
          <GetNewsForGroup />

        {pendingMembers.length > 0 && (
          <div className="group-container">
            <h3>Pending Members:</h3>
            <ul>
              {pendingMembers.map(member => (
                <li key={member.iduser}>
                  {member.username || 'N/A'}
                  {userData.value && userData.value.userid === group[0].idowner && (
                    <button className="groupRelated-button" onClick={() => handleAcceptPendingMember(member.iduser)}>
                      Accept
                    </button>
                  )}
                  {userData.value && userData.value.userid === group[0].idowner && (
                    <button className="groupRelated-button" onClick={() => handleDeleteMember(group[0].idgroup, member.iduser, setGroups, setacceptedMembers)}>
                      Delete Member
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {acceptedMembers.length > 0 && (
            <div className="group-container">
              <h3>Group Members:</h3>
              <ul>
                {acceptedMembers.map(member => (
                  <li key={member.iduser}>
                    {member.username}
                    {userData.value?.userid === group[0].idowner && userData.value?.userid !== member.iduser && (
                      <button className="groupRelated-button" onClick={() => handleDeleteMember(group[0].idgroup, member.iduser, setGroups, setacceptedMembers)}>
                        Delete Member
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {!isUserMember && <p>You need to be a member to access a group's page.</p>}
      {!group && <p>Loading...</p>}
    </div>
  );
};


export default GroupProfileComponent;