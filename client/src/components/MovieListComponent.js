import React, { useState, useEffect } from 'react';
import axios from 'axios';

let pageNum = 1;
const MovieCard = ({ movie }) => {
    return (
      <div className="movie-card">
        <img src={'https://image.tmdb.org/t/p/w200' + movie.poster_path} alt={movie.title} />
        <h2>{movie.title}</h2>
        <p>{movie.overview}</p>
        <p>{movie.id}</p>
      </div>
    );
  };
  
const MovieListComponent = () => {
    const [data, setData] = useState(null);
    const [pageNum, setPageNum] = useState(1);

    const nextPage = () => {
        setPageNum(prevPageNum => prevPageNum + 1);
    };
    const previousPage = () => {
        setPageNum(prevPageNum => (prevPageNum > 1 ? prevPageNum - 1 : 1));
    };
    
    
    useEffect(() => {
        console.log('http://localhost:3001/api/topRated/' + pageNum)
        axios.get('http://localhost:3001/api/topRated/' + pageNum) 
            .then(response => {
                const resultsArray = Array.isArray(response.data.results) ? response.data.results : [];
                setData(resultsArray); 
                console.log(response.data)})
            .catch(error => console.error('Error fetching data:', error));
      }, [pageNum]);
    
      return (
        <div>
            <h1>Top Rated Movies</h1>
            <div className="movie-grid">
                {data?.map(movie => <MovieCard key={movie.id} movie={movie} />)}
            </div>
            <button onClick={previousPage} disabled={pageNum === 1}>Previous page</button>
            <button onClick={nextPage}>Next Page</button>

        </div>
      );
}
export default MovieListComponent;
