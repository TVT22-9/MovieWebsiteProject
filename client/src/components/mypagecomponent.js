import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {  userData } from "./Signals";

function MyPage() {
  const { username } = useParams();
  const [siteStatus, setSiteStatus] = useState('pending');
  const [userSettings, setUserSettings] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [showMovies, setShowMovies] = useState(false);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/settings?username=${username}`);
        setUserSettings(response.data);

        if (username === userData.value?.private) {
          setSiteStatus('owner');
          // Extract individual settings and update state
          setShowReviews(response.data[0]?.ownviewsettings.showreviews || false);
          setShowMovies(response.data[0]?.ownviewsettings.showmovies || false);
        } else {
          // If the user exists, update the site status to 'success'
          setSiteStatus('success');
          setShowReviews(response.data[0]?.ownviewsettings.showreviews || false);
          setShowMovies(response.data[0]?.ownviewsettings.showmovies || false);
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
  }, [username]);

  return (
    <div>
      {siteStatus === 'pending' && <p>Loading...</p>}
      {siteStatus === 'success' && (
        <div>
          <h1>{`${username}'s MyPage`}</h1>
          {userSettings && (
            <div>
              <p>User Settings:</p>
              <pre>{JSON.stringify(userSettings, null, 2)}</pre>
            </div>
          )}
          {showReviews && <PlaceholderReviews />}
          {showMovies && <PlaceholderMovie />}
        </div>
      )}
      {siteStatus === 'owner' && (
        <div>
          <p>{`This is your page ${username}`}</p>
          {showReviews && <PlaceholderReviews />}
          {showMovies && <PlaceholderMovie />}
        </div>
      )}
      {siteStatus === 'failure' && <p>{`User ${username} not found.`}</p>}
      {siteStatus === 'error' && <p>Error occurred while fetching user data.</p>}
    </div>
  );
}

function PlaceholderReviews(){

  return(
      <div>
        <h1> This user wants to see their reviews here</h1>
      </div>
  );
}

function PlaceholderMovie(){

  return(
      <div>
        <h1> This user wants to see their favourite movie here</h1>
      </div>
  );
}

export default MyPage;