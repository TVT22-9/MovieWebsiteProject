import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './MovieCardComponent';
import SeriesCard from './SeriesCardComponent';
import Popup from 'reactjs-popup';

const MovieListComponent = () => {
    //All the neccessery ways to update the useEffect.
    const [data, setData] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [listState, setListState] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [advancedSearch, setAdvancedSearch] = useState(null);

    const [adultSearch, setAdultSearch] = useState(false);
    const [year, setYear] = useState('');
    const [sortBy, setSortBy] = useState('popularity.desc');

    //I decided to have a simple s as the default value making them usable in url without value and the s itself does not affect the api call.
    const [includedGenres, setIncludedGenres] = useState(["s"]);
    const [excludedGenres, setExcludedGenres] = useState(["s"]);

    //Modal state if shown or not. Needed to be able to close the modal on mobile.
    const [isOpen, setIsOpen] = useState(false);

    const genres = [ //Movie genres
        { id: 28, label: 'Action' },
        { id: 12, label: 'Adventure' },
        { id: 16, label: 'Animation' },
        { id: 35, label: 'Comedy' },
        { id: 80, label: 'Crime' },
        { id: 99, label: 'Documentary' },
        { id: 18, label: 'Drama' },
        { id: 10751, label: 'Family' },
        { id: 14, label: 'Fantasy' },
        { id: 36, label: 'History' },
        { id: 27, label: 'Horror' },
        { id: 10402, label: 'Music' },
        { id: 9648, label: 'Mystery' },
        { id: 10749, label: 'Romance' },
        { id: 878, label: 'Science Fiction' },
        { id: 10770, label: 'TV Movie' },
        { id: 53, label: 'Thriller' },
        { id: 10752, label: 'War' },
        { id: 37, label: 'Western' },
    ];
    const tvGenres = [ //TV genres as for some reason they have to be different.
        { id: 10759, label: 'Action & Adventure' },
        { id: 16, label: 'Animation' },
        { id: 35, label: 'Comedy' },
        { id: 80, label: 'Crime' },
        { id: 99, label: 'Documentary' },
        { id: 18, label: 'Drama' },
        { id: 10751, label: 'Family' },
        { id: 10762, label: 'Kids' },
        { id: 9648, label: 'Mystery' },
        { id: 10763, label: 'News' },
        { id: 10764, label: 'Reality' },
        { id: 10765, label: 'Sci-Fi & Fantasy' },
        { id: 10766, label: 'Soap' },
        { id: 10767, label: 'Talk' },
        { id: 10768, label: 'War & Politics' },
        { id: 37, label: 'Western' },
    ];

    const SelectableList = ({ items, selectedItems, onSelect }) => {
        const handleItemClick = (itemId) => {
            const isSelected = selectedItems.indexOf(String(itemId)) !== -1;

            if (isSelected) {
                // If item is already selected, unselect it
                onSelect(selectedItems.filter((id) => id !== String(itemId)));
            } else {
                // If item is not selected, select it
                onSelect([...selectedItems, String(itemId)]);
            }
        };

        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        style={{
                            backgroundColor: selectedItems.indexOf(String(item.id)) !== -1 ? 'lightgreen' : 'lightgray',
                            cursor: 'pointer',
                            padding: '8px',
                            margin: '4px',
                            textAlign: 'center',
                        }}
                    >
                        {item.label}
                    </div>
                ))}
            </div>
        );
    };

    //Basic system to change the page and change between Movies (state 1) and TV Shows (state 2). I have added resets to certain variables like data and search to page changes and list changes as otherwise it may show old data that shouldnt be there anymore.
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
        setAdvancedSearch(null);
        setIncludedGenres(["s"]);
        setExcludedGenres(["s"]);
    };
    const handleSearch = (query) => {
        setSearchQuery(query);
        setAdvancedSearch(null);
        setData(null);
    }
    const handleAdvancedSearch = () => {
        setAdvancedSearch(advancedSearch + 1);
        setAdultSearch(document.getElementsByName('adultBool')[0].value === 'true');
        setYear(document.getElementsByName('year')[0].value);
        setData(null);
        setSearchQuery('');
        setIsOpen(false);

    }
    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                if (advancedSearch) { //If the search is made using advanced search it runs the code below.
                    const includedGenreIds = includedGenres.join(',');
                    const excludedGenreIds = excludedGenres.join(',');

                    let apiUrl = ""
                    if (listState === 1) { // Checks if it should search movies or tv shows.
                        apiUrl = `/api/advancedMovie/${adultSearch}/${pageNum}/${sortBy}/${includedGenres}/${excludedGenreIds}`;
                    } else {
                        apiUrl = `/api/advancedSeries/${adultSearch}/${pageNum}/${sortBy}/${includedGenres}/${excludedGenreIds}`;
                    }
                    if (year) {
                        apiUrl += `/${year}`;
                    }
                    response = await axios.get(apiUrl);
                    console.log(apiUrl);
                } else { //Calls the movies/series using a text input from user.
                    if (searchQuery) {
                        response = await (listState === 1
                            ? axios.get(`/api/searchMovie/${searchQuery}/${pageNum}`)
                            : axios.get(`/api/searchShow/${searchQuery}/${pageNum}`));
                    } else {
                        response = await (listState === 1
                            ? axios.get(`/api/topRatedMovies/${pageNum}`)
                            : axios.get(`/api/topRatedShows/${pageNum}`));
                    }
                }
                const resultsArray = Array.isArray(response.data.results) ? response.data.results : [];
                setData(resultsArray);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, [pageNum, listState, searchQuery, advancedSearch]);

    //Maps all returned data as MovieCard component. Gives all required data which can be assessed using movie.id and movie.title 
    return (
        <body>
            <div className='MovieList'>
                <h1>Top Rated Movies</h1>
                <button onClick={() => setListStateFunc(1)} disabled={listState === 1}>See movies list</button>
                <button onClick={() => setListStateFunc(2)} disabled={listState === 2}>See tv shows list</button>
                <br />
                <div className='searchDiv'>
                    <input
                        className='search'
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <Popup
                        className='MovieListPopup'
                        showCloseButton={true}

                        trigger={<button className='advancedSearchButton'> Advanced Search </button>}
                        modal
                        closeOnDocumentClick={true}
                        onOpen={() => setIsOpen(true)}
                        open={isOpen}
                        onClose={() => setIsOpen(false)}
                    >
                        <div className='advancedSearch'>
                            <h2>Advanced Search</h2>
                            <div className='searchOptions'>
                                <label>Search adult movies? </label>
                                <select name="adultBool" defaultValue={adultSearch}>
                                    <option value='true'>Yes</option>
                                    <option value='false'>No</option>
                                </select>
                                <br />

                                <label> Sort by </label>
                                <select name="sortBySelect" value={sortBy} onChange={handleSortChange}>
                                    <option value='popularity.desc'>Popular</option>
                                    <option value='vote_count.desc'>Rating count</option>
                                    <option value='primary_release_date.desc'>Newest</option>
                                </select>
                                <br />
                                <label> Year: </label>
                                <input type="" name="year" defaultValue={year} />
                            </div>
                            <br />
                            <br />
                            <div className='genreSelect'>
                                <h3>Included Genres</h3>
                                <SelectableList
                                    items={listState === 1 ? genres : tvGenres}
                                    selectedItems={includedGenres}
                                    onSelect={(selectedItems) => setIncludedGenres(selectedItems)}
                                />

                                <h3>Excluded Genres</h3>
                                <SelectableList
                                    items={listState === 1 ? genres : tvGenres}
                                    selectedItems={excludedGenres}
                                    onSelect={(selectedItems) => setExcludedGenres(selectedItems)}
                                />
                            </div>
                            <br></br>
                            <button onClick={async () => {
                                handleAdvancedSearch();
                            }}>Search</button>
                        </div>
                    </Popup>

                </div>
                <div className="movie-grid">
                    {listState === 1 ? data?.map(movie => <MovieCard key={movie.id} id={movie.id} />) : data?.map(series => <SeriesCard key={series.id} id={series.id} />)}
                </div>
                <button onClick={previousPage} disabled={pageNum === 1}>Previous page</button>
                <button onClick={nextPage}>Next Page</button>
            </div>
        </body>
    );
}

export default MovieListComponent;
