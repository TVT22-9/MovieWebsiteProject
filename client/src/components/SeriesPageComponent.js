import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AddReviewWindow, ReviewsList } from './reviewsComponent';
import { jwtToken } from './Signals';
import { Link } from 'react-router-dom';

const SeriesPageComponent = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                response = await axios.get('/api/tvShowId/' + id)
                setData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.response?.status === 404 ? 'Movie not found' : 'Internal Server Error');

            }
        };
        fetchData();
    }, []);

    //This is neccessery for some reason when claling ReviewsList.
    function PlaceholderReviews({ id }) {
        return (
            <div>
                {ReviewsList(null, null, id)}
            </div>
        );
    }

    return (
        <div>
            {error ? (
                <p>{error}</p>
            ) : data ? (
                <pre>
                    <div className='Container'>
                        <div className='Img'>
                            {data.poster_path ? (
                                <img src={'https://image.tmdb.org/t/p/w200' + data.poster_path} alt={data.name} />
                            ) : (
                                <img src={process.env.PUBLIC_URL + '/missingImg.jpg'} alt={data.name} />
                            )}
                        </div>
                        <div className='Desc'>
                            <h1>{data.name}</h1>
                            <h2>Description:</h2>
                            <p>{data.overview}</p>
                        </div>
                        <div className='Data'>
                            <p>Adult: {`${data.adult}`}</p>
                            {data.episode_run_time ? (
                                <p>Episode lenght: {data.episode_run_time} min</p>
                            ) : (
                                <p>Episode lenght unavailable</p>
                            )}
                            <p>Episodes: {data.number_of_episodes}</p>
                            <p>Seasons: {data.number_of_seasons}</p>
                            <p>Status: {data.status}</p>

                            <p>Genres: {data.genres.map(genre => <span key={genre.id}>{genre.name}, </span>)}</p>

                            <p>Vote average: {data.vote_average}</p>
                            <p>Vote count: {data.vote_count}</p>
                        </div>
                        <div className='Reviews'>
                            <h2>Reviews</h2>

                            {jwtToken.value ? (
                                AddReviewWindow(null, data.id)
                            ) : (
                                <button className="reviews-button"><Link to="/user-control">Log in to add a review</Link></button>
                            )}
                            <ReviewsList ids={data.id} />

                        </div>
                    </div>
                </pre>
            ) : (
                <p>Loading data...</p>
            )}

        </div>
    );

}
export default SeriesPageComponent;
