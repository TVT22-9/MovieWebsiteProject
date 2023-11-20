import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _debounce from 'lodash.debounce';
import MovieCard from './MovieCardComponent';
import SeriesCard from './SeriesCardComponent';

const MovieListComponent = () => {
    //All the neccessery ways to update the useEffect.
    const [data, setData] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [listState, setListState] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    
    //Basic system to change the page and change between Movies (state 1) and TV Shows (state 2)
    const nextPage = () => {
        setPageNum(prevPageNum => prevPageNum + 1);
        setData(null);
    };
    const previousPage = () => {
        setPageNum(prevPageNum => (prevPageNum > 1 ? prevPageNum - 1 : 1));
        setData(null);
    };
    const setListStateFunc = (state) => {
        setListState(state);
        setPageNum(1);
        setData(null);

    };
    const handleSearch = (query) => {
        setSearchQuery(query);
        setData(null);

    }
    
    useEffect(() => { 
        const fetchData = async () => {
            try {
                let response;
                console.log("Main component runs");
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

        fetchData();
        
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
                { listState === 1 ? data?.map(movie => <MovieCard key={movie.id} id={movie.id} />) : data?.map(series => <SeriesCard key={series.id} id={series.id} />)} 
            </div>
            <button onClick={previousPage} disabled={pageNum === 1}>Previous page</button>
            <button onClick={nextPage}>Next Page</button>
        </div>
    );
}

export default MovieListComponent;
