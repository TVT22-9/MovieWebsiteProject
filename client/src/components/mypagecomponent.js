import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { userData } from "./Signals";
import Popup from 'reactjs-popup';
import { ReviewsList } from './reviewsComponent';
import MovieCard from './MovieCardComponent'
//MyPage components primary part that gets data and renders stuff on the page based on the data
function MyPage() {
  const { username } = useParams(); //the username is used from webpage params so every user has a mypage that can be accesed with link containing their username
  const [siteStatus, setSiteStatus] = useState('pending'); //set site status to pending, so it renders a loading message instead of anything else
  const [userSettings, setUserSettings] = useState(null); //settings some states here
  const [showReviews, setShowReviews] = useState(false);
  const [showMovies, setShowMovies] = useState(false);
  const [favouriteMovie,setFavouriteMovie] = useState("");
  const handleSettingsChange = (newSettings) => {      //setting up a function that is used to update usersettings
    setUserSettings([{ ownviewsettings: newSettings }]);
    setFavouriteMovie(newSettings.favouritemovie || "");
  };


  const fetchUserSettings = async () => {    //fetchUserSettings gets the users whose page it is settings so it can correctly render stuff
    try {
      const response = await axios.get(`http://localhost:3001/user/settings?username=${username}`);
      setUserSettings(response.data);

      if (username === userData.value?.private) { //if the username matched the loged in accounts name it sets the site status to owner so it can render stuff appropriately
        setSiteStatus('owner');
        setShowReviews(response.data[0]?.ownviewsettings.showreviews || false);
        setShowMovies(response.data[0]?.ownviewsettings.showmovies || false);
        setFavouriteMovie(response.data[0]?.ownviewsettings.favouritemovie || "")
      } else {
        setSiteStatus('success'); //other wise set status to success and render stuff based on that
        setShowReviews(response.data[0]?.ownviewsettings.showreviews || false);
        setShowMovies(response.data[0]?.ownviewsettings.showmovies || false);
        setFavouriteMovie(response.data[0]?.ownviewsettings.favouritemovie || "")
      }
    } catch (error) {
      // Handle errors as needed
      console.error(error);
      setSiteStatus('failure');
    }
  };

  useEffect(() => {
    fetchUserSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return (
    <body>
    <div>
      {siteStatus === 'pending' && <p>Loading...</p>} {/*simple loading message is rendered when site status is pending*/}
      {siteStatus === 'success' && (                  //if the site status is an success it displays the parts that the owner wants people to see based on the owners settings
        <div>
          <h1>{`${username}'s MyPage`}</h1> 
          {showReviews && <MiniComponentReviews username={username} />}
          {showMovies && <MiniComponentMovie favouriteMovie={favouriteMovie} />}
        </div>
      )}
      {siteStatus === 'owner' && (         //if the site status is an success in addition to parts rendered for normal visitors it also allows the user to change settings of the page
        <div>
          <p>{`This is your page ${username}`}</p>
          
          {userSettings && (
        <SettingsButton
          initialSettings={userSettings[0]?.ownviewsettings}
          onSettingsChange={(newSettings) => {
            handleSettingsChange(newSettings);
            fetchUserSettings(); // Trigger a refetch after updating settings
          }} />
          )}
          {showReviews && <MiniComponentReviews username={username} />}
          {showMovies && <MiniComponentMovie favouriteMovie={favouriteMovie} />}
        </div>
      )}
      {siteStatus === 'failure' && <p>{`User ${username} not found.`}</p>}
      {siteStatus === 'error' && <p>Error occurred while fetching user data.</p>}
    </div>
    </body>
  );
}

function MiniComponentReviews({ username }) { //mini component that renders reviews the given user has made

  return (
    <div>
      
      <h1>My reviews</h1>
      {ReviewsList(username, null, null)}
    </div>
  );
}

function MiniComponentMovie({ favouriteMovie }) {
  useEffect(() => {
  }, [favouriteMovie]); 
  return (
    <div>
      <h1>My favorite movie!</h1>
      {favouriteMovie ? (
        <MovieCard id={favouriteMovie} />
      ) : (
        <p>This user has not set up their favorite movie.</p>
      )}
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
      const existingFavouriteMovie = initialSettings.favouritemovie || '';

      const response = await axios.put('http://localhost:3001/user/updatesettings', {
        username,
        newsettings: JSON.stringify({ ...settings, favouritemovie: existingFavouriteMovie }),
      });

      const updatedUserSettings = response.data;

      onSettingsChange(updatedUserSettings);
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Settings</button>
      <Popup open={isOpen} closeOnDocumentClick onClose={() => setIsOpen(false)}>
        <div className='settingspopup'>
          <h3>Settings</h3>
          <div>
            <label>
              Show My Reviews:
              <input
                type="checkbox"
                checked={settings.showreviews}
                onChange={() => handleSwitchChange('showreviews')}
              />
            </label>
          </div>
          <div>
            <label>
              Show My Favourite Movie:
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