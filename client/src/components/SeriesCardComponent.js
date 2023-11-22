import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AddReviewWindow } from './reviewsComponent';
import { jwtToken } from './Signals';

const SeriesCard = ({ id }) => {
    //The movie card that shows all neccessery data in the series list. Edit this to decide what data the list shows
    const [data, setData] = useState(null);

    useEffect(() => { 
        const fetchData = async () => {
            try {
                let response;
                response = await axios.get('http://localhost:3001/api/tvShowId/' + id)
                setData(response.data);
                //console.log(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);

            }
        };
        fetchData();
        console.log("Call this once");
        
    }, []);

    return (
        <div className="series-card">
            {data ? (
                <pre>
                    <img src={'https://image.tmdb.org/t/p/w200' + data.poster_path} alt={data.name} />            
                    <h2>{data.name}</h2>
                    <p>Describtion: {data.overview}</p>
                    <p>{data.id}</p>
                    <p>Seasons: {data.number_of_seasons}</p>
                    {jwtToken.value ? (
                        AddReviewWindow(null, data.id)
                    ) : (
                        <p>Login to add a review</p>
                    )}
                    
                </pre>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};
export default SeriesCard;
