import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _debounce from 'lodash.debounce';
  
const MovieListComponent = () => {
    //All the neccessery ways to update the useEffect.
    const [data, setData] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [listState, setListState] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const MovieCard = ({ movie }) => {
        //The movie card that shows all neccessery data in the movie list. Edit this to decide what data the list shows
        // WARNING This component currently uses listState that is part of MovieListComponent. Should we move this to its own component we need to change how it receive data to work.
        // For some reason movies return their name as title while TV shows return as name.
        return (
            <div className="movie-card">
                <img src={'https://image.tmdb.org/t/p/w200' + movie.poster_path} alt={movie.title} />
                <h2>{listState === 1 ? movie.title : movie.name}</h2>
                <p>{movie.overview}</p>
                <p>{movie.id}</p>
            </div>
        );
    };
    
    //Basic system to change the page and change between Movies (state 1) and TV Shows (state 2)
    const nextPage = () => {
        setPageNum(prevPageNum => prevPageNum + 1);
    };
    const previousPage = () => {
        setPageNum(prevPageNum => (prevPageNum > 1 ? prevPageNum - 1 : 1));
    };
    const setListStateFunc = (state) => {
        setListState(state);
    };
    const handleSearch = (query) => {
        setSearchQuery(query);
    }
    
    useEffect(() => { 
        const fetchData = async () => {
            try {
              let response;
        
              if (searchQuery) {
                response = await (listState === 1
                  ? axios.get(`http://localhost:3001/api/searchMovie/${searchQuery}/${pageNum}`)
                  : axios.get(`http://localhost:3001/api/searchShow/${searchQuery}/${pageNum}`));
              } else {
                response = await (listState === 1
                  ? axios.get(`http://localhost:3001/api/topRatedMovies/${pageNum}`)
                  : axios.get(`http://localhost:3001/api/topRatedShows/${pageNum}`));
              }
        
              const resultsArray = Array.isArray(response.data.results) ? response.data.results : [];
              setData(resultsArray);
              console.log(response.data);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
           // I read an old post of tmdb that said that calls faster than 50 per second are blocked as a ddos protection so i decided to add a delay to this just in case. If unneccesery then simply remove this and the import from top.
           // In the case that we remove the delay we simply need to call fetchData.
          const debouncedFetchData = _debounce(fetchData, 100);
          debouncedFetchData();

          return () => debouncedFetchData.cancel();
    }, [pageNum, listState, searchQuery]);
    

    //Maps all returned data as MovieCard component. Gives all required data which can be assessed using movie.id and movie.title 
    return (
        <div>
            <h1>Top Rated Movies</h1>
            <button onClick={() => setListStateFunc(1)} disabled={listState === 1}>See movies list</button>
            <button onClick={() => setListStateFunc(2)} disabled={listState === 2}>Next Page</button>

            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
            />

            <div className="movie-grid">
                {data?.map(movie => <MovieCard key={movie.id} movie={movie} />)} 
            </div>
            <button onClick={previousPage} disabled={pageNum === 1}>Previous page</button>
            <button onClick={nextPage}>Next Page</button>
        </div>
    );
}
export default MovieListComponent;
