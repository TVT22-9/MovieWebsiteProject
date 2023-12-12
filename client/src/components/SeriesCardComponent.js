import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AddReviewWindow } from './reviewsComponent';
import { jwtToken } from './Signals';
import { Link } from 'react-router-dom';

const SeriesCard = ({ id }) => {
    //The movie card that shows all neccessery data in the series list. Edit this to decide what data the list shows
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                response = await axios.get('/api/tvShowId/' + id)
                setData(response.data);
                //console.log(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);

            }
        };
        fetchData();

    }, []);

    return (
        <div>
            {data ? (
                <pre>
                    <div className="MovieCard">

                        <div className='CardImg'>
                            {data.poster_path ? (
                                <img src={'https://image.tmdb.org/t/p/w200' + data.poster_path} alt={data.name} />
                            ) : (
                                <img src={process.env.PUBLIC_URL + '/missingImg.jpg'} alt={data.name} />
                            )}
                        </div>
                        <div className='CardDesc'>
                            <h2>{data.name}</h2>
                            <p>Describtion: {data.overview}</p>
                            <p>Genres: {data.genres.map(genre => <span key={genre.id}>{genre.name}, </span>)}</p>
                            <p>Status: {data.status}</p>
                            <p>Episodes: {data.number_of_episodes}</p>
                            <p>Seasons: {data.number_of_seasons}</p>
                        </div>
                        <div className='CardButtons'>
                            <Link to={'/series/' + data.id} ><button>Go to series page</button></Link>

                            {jwtToken.value ? (
                                AddReviewWindow(null, data.id)
                            ) : (
                                <button className="reviews-button"><Link to="/user-control">Log in to add a review</Link></button>
                            )}
                        </div>
                    </div>
                </pre>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};
export default SeriesCard;
