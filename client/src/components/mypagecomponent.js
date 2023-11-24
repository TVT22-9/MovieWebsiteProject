import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {  userData } from "./Signals";
import Popup from 'reactjs-popup';

function MyPage() {
  const { username } = useParams();
  const [siteStatus, setSiteStatus] = useState('pending');
  const [userSettings, setUserSettings] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [showMovies, setShowMovies] = useState(false);
  const handleSettingsChange = (newSettings) => {
    setUserSettings([{ ownviewsettings: newSettings }]);
  };


  const fetchUserSettings = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/user/settings?username=${username}`);
      setUserSettings(response.data);

      if (username === userData.value?.private) {
        setSiteStatus('owner');
        setShowReviews(response.data[0]?.ownviewsettings.showreviews || false);
        setShowMovies(response.data[0]?.ownviewsettings.showmovies || false);
      } else {
        setSiteStatus('success');
        setShowReviews(response.data[0]?.ownviewsettings.showreviews || false);
        setShowMovies(response.data[0]?.ownviewsettings.showmovies || false);
      }
    } catch (error) {
      // Handle errors as needed
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <div>
              <p>User Settings:</p>
              <pre>{JSON.stringify(userSettings, null, 2)}</pre>
            </div>
          {userSettings && (
        <SettingsButton
          initialSettings={userSettings[0]?.ownviewsettings}
          onSettingsChange={(newSettings) => {
            handleSettingsChange(newSettings);
            fetchUserSettings(); // Trigger a refetch after updating settings
          }} />
          )}
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

function SettingsButton({ initialSettings, onSettingsChange }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitchChange = (setting) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [setting]: !prevSettings[setting],
    }));
  };

  const saveSettings = async () => {
    try {
      const username = userData.value?.private; 
      const response = await axios.put('http://localhost:3001/user/updatesettings', {
        username,
        newsettings: JSON.stringify(settings),
      });

      // Assuming the response contains the updated user settings
      const updatedUserSettings = response.data;

      // Update the state with the new settings
      onSettingsChange(updatedUserSettings);
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating settings:', error);
      // Handle errors as needed
    }
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Settings</button>
      <Popup open={isOpen} closeOnDocumentClick onClose={() => setIsOpen(false)}>
        <div>
          <h3>Settings</h3>
          <div>
            <label>
              Show Reviews:
              <input
                type="checkbox"
                checked={settings.showreviews}
                onChange={() => handleSwitchChange('showreviews')}
              />
            </label>
          </div>
          <div>
            <label>
              Show Movies:
              <input
                type="checkbox"
                checked={settings.showmovies}
                onChange={() => handleSwitchChange('showmovies')}
              />
            </label>
          </div>
          <button onClick={saveSettings}>Save</button>
        </div>
      </Popup>
    </div>
  );
}

export default MyPage;