import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { userData } from "./Signals";


function FavouriteMovieButton({ movieId }) {
    const username = userData.value?.private;
    const [userSettings, setUserSettings] = useState(null);
    const [buttonText, setButtonText] = useState('Set as Favorite');

    useEffect(() => {
        // Fetch user settings when the component mounts
        const fetchUserSettings = async () => {
            try {
                const response = await axios.get(`/user/settings?username=${username}`);
                setUserSettings(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserSettings();
    }, [username]);

    const handleButtonClick = async () => {
        try {
            // Update user settings with the new favorite movie
            const newSettings = {
                ...userSettings[0].ownviewsettings,
                favouritemovie: movieId,
            };

            await axios.put('/user/updatesettings', {
                username: username,
                newsettings: JSON.stringify(newSettings),
            });

            // Update local state to reflect the change
            setUserSettings([{ ownviewsettings: newSettings }]);
            setButtonText('Success');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button onClick={handleButtonClick} disabled={buttonText === 'Success'}>
            {buttonText}
        </button>
    );
}

export default FavouriteMovieButton;