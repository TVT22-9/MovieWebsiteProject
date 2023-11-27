import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AddReviewWindow, ReviewsList } from './reviewsComponent';
import { jwtToken } from './Signals';

const SeriesPageComponent = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => { 
        const fetchData = async () => {
            try {
                let response;
                response = await axios.get('http://localhost:3001/api/tvShowId/' + id)
                setData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.response?.status === 404 ? 'Movie not found' : 'Internal Server Error');

            }
        };
        fetchData();
    }, []);
    
    return (
        <div>
            {error ? (
                <p>{error}</p>
            ) : data ? (
                <pre>
                    <img src={'https://image.tmdb.org/t/p/w200' + data.poster_path} alt={data.name} />
                    <h2>{data.name}</h2>
                    <p>Description: {data.overview}</p>
                    <p>{data.id}</p>
                    <p>Adult: {`${data.adult}`}</p>
                    <p>Episode lenght: {data.episode_run_time} Minutes</p>
                    <p>Episodes: {data.number_of_episodes}</p>
                    <p>Seasons: {data.number_of_seasons}</p>
                    <p>Status: {data.status}</p>

                    <p>Genres: {data.genres.map(genre => <span key={genre.id}>{genre.name}, </span>)}</p>

                    <p>Vote average: {data.vote_average}</p>
                    <p>Vote count: {data.vote_count}</p>

                    {jwtToken.value ? (
                        AddReviewWindow(null, data.id)
                    ) : (
                        <p>Login to add a review</p>
                    )}
                </pre>
            ) : (
                <p>Loading data...</p>
            )}
            <h2>Reviews</h2>
            {ReviewsList(null, null, id)}
        </div>
      );
  
}
export default SeriesPageComponent;
