import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AddReviewWindow, ReviewsList } from './reviewsComponent';
import { jwtToken } from './Signals';
import FavouriteMovieButton from './favouriteMovieButton';

const MoviePageComponent = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => { 
        const fetchData = async () => {
            try {
                let response;
                response = await axios.get('http://localhost:3001/api/movieId/' + id)
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
                {ReviewsList(null, id, null)}
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
                                <img src={'https://image.tmdb.org/t/p/w200' + data.poster_path} alt={data.title} />
                            ) : (
                                <img src={process.env.PUBLIC_URL + '/missingImg.jpg'} alt={data.title} />
                            )}
                        </div>
                        <div className='Desc'>
                            <h1>{data.title}</h1>
                            <h2>Description:</h2>
                            <p>{data.overview}</p>
                        </div>
                        <div className='Data'>
                            <p>Adult: {`${data.adult}`}</p>
                            <p>Runtime: {data.runtime} min</p>
                            <p>Genres: {data.genres.map(genre => <span key={genre.id}>{genre.name}, </span>)}</p>

                            <p>Vote average: {data.vote_average}</p>
                            <p>Vote count: {data.vote_count}</p>
                        </div>
                        <div className='Reviews'>
                            <h2>Reviews</h2>
                            
                            {jwtToken.value ? (
                                AddReviewWindow(data.id, null)
                            ) : (
                                <p>Login to add a review</p>
                            )}
                            <PlaceholderReviews id= {data.id} />
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
}
const FavouriteMovie = ({ movieId }) => {
    return (
        <div>
            <FavouriteMovieButton movieId={movieId} />
        </div>
    );
};
export default MoviePageComponent;
