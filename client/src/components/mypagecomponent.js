import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {  userData } from "./Signals";

function MyPage() {
  const { username } = useParams();
  const [siteStatus, setSiteStatus] = useState('pending');
  const [userSettings, setUserSettings] = useState(null);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/settings?username=${username}`);
        setUserSettings(response.data);

        if (username === userData.value?.private) {
            setSiteStatus('owner');
          } else {
        // If the user exists, update the site status to 'success'
            setSiteStatus('success');
          }
      } catch (error) {
        // If the user is not found, update the site status to 'failure'
        if (error.response && error.response.status === 404) {
          setSiteStatus('failure');
        } else {
          // Handle other errors
          console.error(error);
          setSiteStatus('error');
        }
      }
    };

    // Call the fetchUserSettings function when the component mounts
    fetchUserSettings();
  }, [username]); // Include username as a dependency to re-run the effect when it changes

  return (
    <div>
      {siteStatus === 'pending' && <p>Loading...</p>}
      {siteStatus === 'success' && (
        <div>
          <h1>{`${username}'s MyPage`}</h1>
          {/* Display user settings or perform other actions as needed */}
          {/* Example: Display user settings */}
          {userSettings && (
            <div>
              <p>User Settings:</p>
              {/* Display user settings here */}
              {/* Example: */}
              <pre>{JSON.stringify(userSettings, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
      {siteStatus === 'owner' && <p>{`This is your page ${username}`}</p>}
      {siteStatus === 'failure' && <p>{`User ${username} not found.`}</p>}
      {siteStatus === 'error' && <p>Error occurred while fetching user data.</p>}
    </div>
  );
}

export default MyPage;