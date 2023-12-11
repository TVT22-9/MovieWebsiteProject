import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AddReviewWindow } from './reviewsComponent';
import { jwtToken } from './Signals';
import { Link } from 'react-router-dom';
import FavouriteMovieButton from './favouriteMovieButton';

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
        <div>
            {data ? (
                <pre>
                    <div className="MovieCard">

                        <div className='CardImg'>
                            {data.poster_path ? (
                                <img src={'https://image.tmdb.org/t/p/w200' + data.poster_path} alt={data.title} />
                            ) : (
                                <img src={process.env.PUBLIC_URL + '/missingImg.jpg'} alt={data.title} />
                            )}
                        </div>
                        <div className='CardDesc'>
                            <h2>{data.title}</h2>
                            <p>Describtion: {data.overview}</p>
                            <p>Genres: {data.genres.map(genre => <span key={genre.id}>{genre.name}, </span>)}</p>
                            <p>Runtime: {data.runtime} min</p>
                        </div>
                        <div className='CardButtons'>
                            <Link to={'/movie/' + data.id} ><button>Go to movie page</button></Link>

                            {jwtToken.value ? (
                                AddReviewWindow(data.id, null)
                            ) : (
                                <button className="reviews-button"><Link to="/user-control">Log in to add a review</Link></button>
                            )}
                       {jwtToken.value ? (
                                <FavouriteMovie movieId={data.id} />
                            ) : (
                                <p></p>
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

const FavouriteMovie = ({ movieId }) => {
    return (
        <div>
            <FavouriteMovieButton movieId={movieId} />
        </div>
    );
};
export default MovieCard;

