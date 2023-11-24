import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AddReviewWindow } from './reviewsComponent';
import { jwtToken } from './Signals';

const MovieCard = ({ id }) => {
    //The movie card that shows all neccessery data in the series list. Edit this to decide what data the list shows
    const [data, setData] = useState(null);
    useEffect(() => { 
        const fetchData = async () => {
            try {
                let response;
                response = await axios.get('http://localhost:3001/api/movieId/' + id)
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
                    <img src={'https://image.tmdb.org/t/p/w200' + data.poster_path} alt={data.title} />            
                    <h2>{data.title}</h2>
                    <p>Describtion: {data.overview}</p>
                    <p>{data.id}</p>
                    {jwtToken.value ? (
                        AddReviewWindow(data.id, null)
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
export default MovieCard;
