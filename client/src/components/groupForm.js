import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtToken } from "./Signals";
import {  userData } from "./Signals";

const GroupForm = () => {
  const [groups, setGroups] = useState([]);
  const [groupData, setGroupData] = useState({
    groupName: '',
    description: '',
    groupsettings: { shownews: true },
    groupId: '',
    userid: ''
  });

  useEffect(() => {
    // Fetch all groups when the component first loads
    axios.get('http://localhost:3001/groups/all')
    .then(response => {
      console.log('Groups received:', response.data.groups);
      setGroups(response.data.groups);
    }).catch(error => console.error('Error fetching groups:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreateGroup = async () => {
    console.log('Group Data:', groupData);
    console.log('User Data:', userData.value);
    console.log('User Data:', userData.value.userid);
    console.log('Current Token:', jwtToken.value);
    try {
      const ownerId = userData.value.userid;
      
      // Send a POST request to create a new group
      const response = await axios.post(
        'http://localhost:3001/groups/create',
        {
          groupName: groupData.groupName,
          description: groupData.description,
          groupsettings: JSON.stringify(groupData.groupsettings),
          idowner: ownerId,
        },
        {
          headers: { Authorization: `Bearer ${jwtToken.value}` },
        }
      );
  
      // Check if the response contains a group property
      if (response.data.group) {
        console.log('Group created successfully:', response.data.group);
        
        // Add the owner as a member of the newly created group
        const addMemberResponse = await axios.post(
          `http://localhost:3001/groups/${response.data.group.idgroup}/add`,
          {
            userId: ownerId,
            acceptedPool: true,
          },
          {
            headers: { Authorization: `Bearer ${jwtToken.value}` },
          }
        );
  
        if (addMemberResponse.data.memberExists) {
          console.log('Owner is already a member of the group.');
        } else {
          console.log('Owner added as a member of the group:', addMemberResponse.data.member);
        }
  
        // Update the groups state with the newly created group
        setGroups(response.data.groups);
      } else {
        console.log('Group created successfully, but no group data received in response.');
      }
    } catch (error) {
      console.error('Error creating group:', error.response || error);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      const id = parseInt(groupId, 10);
      const response = await axios.delete(`http://localhost:3001/groups/delete/${id}`);

      // Update the groups state by removing the deleted group
      setGroups(prevGroups => prevGroups.filter(group => group.idgroup !== id));

      console.log('Group deleted successfully:', response.data.result);
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  const handleSendJoinRequest = async (groupId) => {
    try {
      console.log('Sending join request for groupId:', groupId); // Add this line for debugging
      const response = await axios.post(`http://localhost:3001/groups/${groupId}/add-member`, {
        userId: userData.value.userid,
        acceptedPool: false,
      });
      console.log('Join request sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending join request:', error.response || error);
    }
  };

 /* const handleAcceptPendingMember = async (userId, groupId) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/members/${groupId}/update-member/${userId}`,
        {
          acceptedPool: true,
        }
      );
      console.log('Join request accepted successfully:', response.data);

      // You may want to refetch the group details after accepting the join request
      // to update the list of members.

      const updatedGroups = groups.map((group) =>
        group.idgroup === groupId
          ? { ...group, joinRequests: group.joinRequests.filter((request) => request.userId !== userId) }
          : group
      );
      setGroups(updatedGroups);
    } catch (error) {
      console.error('Error accepting join request:', error.response || error);
    }
  };*/
  
  
  

  const handleSubmit = (e) => {    
    e.preventDefault();
    handleCreateGroup();
  };

  

  return (
    <div>
      <h1>Create, browse and join groups! Note that you have to be logged in to send join requests.</h1>
      {jwtToken.value.length === 0 && (
        <div>
          <h2>All Groups:</h2>
          <ul>
            {groups && groups.map((group) => (
              <li key={group.idgroup}>
                <strong>{group.groupname}</strong> - {group.groupdescription || 'No description available'}
              </li>
            ))}
          </ul>
        </div>
      )}
      {jwtToken.value.length > 0 && (
        <div>
          <form onSubmit={handleSubmit}>
            <label>
              Group Name:
              <input type="text" name="groupName" value={groupData.groupName} onChange={handleChange} />
            </label>
            <br />
            <label>
              Description:
              <textarea name="description" value={groupData.description} onChange={handleChange} />
            </label>
            <br />
            <button type="submit">Create Group</button>
          </form>
          <h2>All Groups:</h2>
          <ul>
            {groups && groups.map((group) => (
              <li key={group.idgroup}>
                <strong>{group.groupname}</strong> - {group.groupdescription || 'No description available'}
                <Link to={`/group/${group.idgroup}`}>
                  <button>Click here to see group page</button>
                </Link>
                {userData.value && userData.value.userid !== group.idowner && (
                  <button onClick={() => handleSendJoinRequest(group.idgroup)}>Send Join Request</button>
                )}
                {userData.value && userData.value.userid === group.idowner && (
                  <button onClick={() => handleDeleteGroup(group.idgroup)}>Delete</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GroupForm;
