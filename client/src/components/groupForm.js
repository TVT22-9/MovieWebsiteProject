import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtToken } from "./Signals";
import { userData } from "./Signals";
import '../group.css';

//Component for creating groups, browsing groups made by others and sending join requests
//to those groups. Next to group names are buttons for the group profile and 
//sending join requests if user is not a member, as well as delete button for the owner.

const GroupForm = () => {
  const [groups, setGroups] = useState([]);
  const [acceptedMembers, setAcceptedMembers] = useState([]);
  const [groupData, setGroupData] = useState({
    groupName: '',
    description: '',
    groupsettings: { shownews: true },
    groupId: '',
    userid: ''
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  useEffect(() => {
    // Fetch all groups when the component first loads
    axios.get('/groups/all')
      .then(response => {
        setGroups(response.data.groups);
      }).catch(error => console.error('Error fetching groups:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData((prevData) => ({ ...prevData, [name]: value }));
  };

  //Creates a new group, adds the owner as a member in the group,
  //then fetches the updates list of groups
  const handleCreateGroup = async () => {
    try {
      const ownerId = userData.value.userid;

      // Send a POST request to create a new group
      const response = await axios.post(
        '/groups/create',
        {
          groupName: groupData.groupName,
          description: groupData.description,
          groupsettings: JSON.stringify(groupData.groupsettings),
          idowner: ownerId,
          groupid: groupData.groupId
        },
        {
          headers: { Authorization: `Bearer ${jwtToken.value}` },
        }
      );

      // Check if the response contains a group property
      if (response.data.group) {

        // Extract the newly created group ID from the server response
        const createdGroupId = response.data.group.idgroup;

        // Ensure that createdGroup is an object
        if (typeof response.data.group === 'object') {
          // Add the owner as a member of the newly created group
          const addMemberResult = await axios.post(
            `/members/${createdGroupId}/add-owner-as-member`,
            {
              userId: ownerId,
              status: true,
            },
            {
              headers: { Authorization: `Bearer ${jwtToken.value}` },
            }
          );

          // Refetch the updated list of groups
          const updatedGroupsResponse = await axios.get('/groups/all');
          setGroups(updatedGroupsResponse.data.groups);
        } else {
          console.error('Error: createdGroup is not an object.');
        }
      } else {
        // Handle the case when group creation is not successful
      }
    } catch (error) {
      console.error('Error creating group:', error.response || error);
    }
  };

  //Deletes a single or all members of a group.
  const handleDeleteMember = async (groupId, memberId, setMembers) => {
    try {
      if (memberId) {
        // Regular delete for a single member
        const response = await axios.delete(`/members/${groupId}/members/${memberId}`);

        // Update the members state by removing the deleted member
        setMembers(prevMembers => prevMembers.filter(member => member.iduser !== memberId));

      } else {
        // Delete all members of the group
        const deleteAllMembersResponse = await axios.delete(`/members/${groupId}/delete-all-members`);

        // Assuming the response contains deleted members, update the state accordingly
        setMembers([]);

      }
    } catch (error) {
      console.error('Error deleting members:', error);
    }
  };

  const handleDeleteGroup = (groupId) => {
    setGroupToDelete(groupId);
    setShowConfirmation(true);
  };

  const handleDeleteGroupConfirmed = async () => {
    try {
      const id = parseInt(groupToDelete, 10);

      // Use the new endpoint to delete all members of the group
      await handleDeleteMember(groupToDelete, null);

      // Now that members are deleted, delete the group itself
      const response = await axios.delete(`/groups/delete/${id}`);

      // Update the groups state by removing the deleted group
      setGroups((prevGroups) => prevGroups.filter((group) => group.idgroup !== id));

      // Hide the confirmation pop-up
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  //Sends a post request to add a user as a pending member, waiting to be accepted.
  const handleSendJoinRequest = async (groupId) => {
    try {
      const response = await axios.post(`/groups/${groupId}/add-member`, {
        userId: userData.value.userid,
        acceptedPool: false,
      });
    } catch (error) {
      console.error('Error sending join request:', error.response || error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupData.groupName.trim()) {
      alert('Group name cannot be empty!');
      return;
    }
    handleCreateGroup();
  };



  return (
    <body>
      <div>
        <h1>Create, browse and join groups! Note that you have to be logged in to send join requests.</h1>
        {jwtToken.value.length > 0 && (
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <p className="group-container">
                <span>Group name:</span>
                <input type="text" name="groupName" value={groupData.groupName} onChange={handleChange} />
              </p>
              <p className="group-container">
                <span>Description:</span>
                <input name="description" value={groupData.description} onChange={handleChange} />
              </p>
              <br />
              <button className="create-group-button" type="submit">Click here to create the group!</button>
            </form>
          </div>
        )}
        <div className="group-container">
          <h2>All Groups:</h2>
          <ul>
            {groups && groups.map((group) => (
              <li key={group.idgroup}>
                <strong>{group.groupname}</strong> - {group.groupdescription || 'No description available'}
                <Link to={`/group/${group.idgroup}`}>
                  <button className="groupRelated-button">Click here to see group page</button>
                </Link>
                {userData.value && userData.value.userid !== group.idowner && (
                  <button className="groupRelated-button" onClick={() => handleSendJoinRequest(group.idgroup)}>Send Join Request</button>
                )}
                {userData.value && userData.value.userid === group.idowner && (
                  <>
                    <button className="groupRelated-button" onClick={() => handleDeleteGroup(group.idgroup)}>Delete</button>
                    {showConfirmation && (
                      <div className="confirmation-popup">
                        <p>Are you sure you want to delete this group?</p>
                        <button className="groupRelated-button" onClick={handleDeleteGroupConfirmed}>Yes</button>
                        <button className="groupRelated-button" onClick={() => setShowConfirmation(false)}>No</button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </body>
  );
};

export default GroupForm;
