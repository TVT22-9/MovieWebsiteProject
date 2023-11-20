import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupForm = () => {
  const [groups, setGroups] = useState([]);
  const [groupData, setGroupData] = useState({
    groupName: '',
    description: '',
  });

  useEffect(() => {
    // Fetch all groups when the component first loads
    axios.get('http://localhost:3001/groups/all')
      .then(response => setGroups(response.data.groups))
      .catch(error => console.error('Error fetching groups:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreateGroup = async () => {
    try {
      // Send a POST request to create a new group
      const response = await axios.post('http://localhost:3001/groups/create', groupData);
  
      // Check if the response contains a group property
      if (response.data.group) {
        console.log('Group created successfully:', response.data.group);
        const updatedGroups = await axios.get('http://localhost:3001/groups/all');
        setGroups(updatedGroups.data.groups);
      } else {
        console.log('Group created successfully, but no group data received in response.');
      }
    } catch (error) {
      console.error('Error creating group:', error);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateGroup();
  };

  return (
    <div>
      <h1>Movie website!</h1>
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
        {groups.map((group) => (
          <li key={group.idgroup}>
            <strong>{group.groupname}</strong> - {group.groupdescription || 'No description available'}
            <button onClick={() => handleDeleteGroup(group.idgroup)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupForm;
