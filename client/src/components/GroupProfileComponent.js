import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {  userData } from "./Signals";



const GroupProfileComponent = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [acceptedMembers, setacceptedMembers] = useState([]);

  console.log('Initial Members State:', acceptedMembers);

  const [pendingMembers, setPendingMembers] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    // Fetch group details based on groupId
    axios.get(`http://localhost:3001/groups/${groupId}`)
      .then(response => {
        console.log('Response from server:', response.data);
        setGroup(response.data.group || null);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => console.error('Error fetching group members:', error))
      .then(() => setLoading(false))
      .catch(error => console.error('Error setting loading state:', error));

  // Fetch all members of the group with TRUE
  axios.get(`http://localhost:3001/members/${groupId}/get`)
  .then(response => {
    console.log('Members of the group:', response.data.acceptedMembers);
    setacceptedMembers(response.data.acceptedMembers || []);
  })
  .catch(error => console.error('Error fetching group members:', error))
  .finally(() => setLoading(false));

  // Fetch pending members of the group with usernames
  axios.get(`http://localhost:3001/members/${groupId}/pending-members-with-usernames`)
  .then(response => {
    console.log('Pending Members of the group with usernames:', response.data.pendingMembers);

    // Use the callback form of setPendingMembers to get the updated state value
    setPendingMembers(prevPendingMembers => response.data.pendingMembers || []);
  })
  .catch(error => console.error('Error fetching pending group members with usernames:', error));

  fetchAcceptedMembers();
}, [groupId]);

    




  const getPendingMembers = async (groupId) => {
    try {
      const response = await axios.get(`http://localhost:3001/members/${groupId}/pending-members`);
      return response.data.pendingMembers || [];
    } catch (error) {
      console.error('Error fetching pending group members:', error);
      throw error;
    }
  };


  const handleAcceptPendingMember = async (userId) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/members/${groupId}/update-member/${userId}`,
        {
          acceptedPool: true,
        }
      );
      console.log('Join request accepted successfully:', response.data);

      axios.get(`http://localhost:3001/groups/${groupId}`)
        .then(response => {
          console.log('Response from server:', response.data);
          setGroup(response.data.group || null);
        })
        .catch(error => console.error('Error fetching group details:', error));

      axios.get(`http://localhost:3001/members/${groupId}/get`)
        .then(response => {
          console.log('Members of the group:', response.data.acceptedMembers);
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

    const fetchAcceptedMembers = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/members/${groupId}/get`);
        console.log('Accepted Members of the group:', response.data.acceptedMembers);
    
        // Use the callback form of setMembers to get the updated state value
        setacceptedMembers(prevMembers => response.data.acceptedMembers || []);
      } catch (error) {
        console.error('Error fetching accepted group members:', error);
      }
    };
    

  const handleDeclineJoinRequest = async (userId) => {
    try {
      // Placeholder function for declining join requests
      console.log('Join request declined for user ID:', userId);
    } catch (error) {
      console.error('Error declining join request:', error.response || error);
    }
  };
  

  console.log('Rendered with group:', group);

  return (
    <div>
      <h2>Group Profile</h2>
      {group && (
        <div>
          <p>Group Name: <strong>{group.groupname}</strong></p>
          <p>Description: {group.groupdescription}</p>
          <p>Here would be news etc added by users:</p>
  
          {/* Display both pending and accepted members of the group */}
          {pendingMembers.length > 0 && (
            <div>
              <h3>Pending Members:</h3>
              <ul>
                {pendingMembers.map(member => (
                  <li key={member.iduser}>
                    {member.username || 'N/A'} {/* Display username, or 'N/A' if not available */}
                    {/* Buttons for accepting and declining members */}
                    <button onClick={() => handleAcceptPendingMember(member.iduser)}>
                      Accept
                    </button>
                    {/* <button onClick={() => handleDeclinePendingMember(member.iduser)}>
                      Decline
                    </button> */}
                  </li>
                ))}
              </ul>
            </div>
          )} 
  
          {/* Display accepted members of the group */}
          {acceptedMembers.length > 0 && (
            <div>
              <h3>Group Members:</h3>
              <ul>
                {acceptedMembers.map(member => (
                  <li key={member.iduser}>{member.username}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {!group && <p>Loading...</p>}
    </div>
  );
};


export default GroupProfileComponent;