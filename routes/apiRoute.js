const express = require('express');
const apiOptions = require('../api_tools/api_options'); 
const router = express.Router();

// Movies below this
router.get('/topRatedMovies/:page', async (req, res) => { // Get top rated movies per page.
    try {
        const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page='+req.params.page;
        const response = await fetch(url, apiOptions);
        const result = await response.json();
        if (result.success === false) {
            res.status(404).json({ success: false, message: 'Invalid page: Pages start at 1 and max at 500. They are expected to be an integer' });
        } else {
            res.json(result);
        }
              
    } catch (error) {
        console.error('Error connecting to API', error);
        res.status(404).send('Internal Server Error');
    }
});
router.get('/movieId/:id', async (req, res) => { // Gets movie using the id
    try {
        const url = 'https://api.themoviedb.org/3/movie/'+ req.params.id +'?language=en-US';
        const response = await fetch(url, apiOptions);
        const result = await response.json();
        if (result.success === false) {
            res.status(404).json({ success: false, message: 'Movie not found' });
        } else{
            res.json(result);
        }

    } catch (error) {
        console.error('Error connecting to API', error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/searchMovie/:query/:page', async (req, res) => { // Search Movies shows by name.
    try {
        const url = 'https://api.themoviedb.org/3/search/movie?query='+ req.params.query +'&language=en-US&page='+ req.params.page;
        const response = await fetch(url, apiOptions);
        const result = await response.json();

        if (result.success === false) {
            res.status(404).json({ success: false, message: 'The resource you requested could not be found' });
        } else{
            res.json(result);
        }

    } catch (error) {
        console.error('Error connecting to API', error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/advancedMovie/:adult/:page/:sort/:genres/:negGenres/:year?', async (req, res) => { // Search Movies shows by everything.
    //Search using adult, genres, year, without genres. Sort by popularity, rating and date. popularity.desc
    //Genres work using genre IDs. You can search multiple genres at a time by having , in between like 27, 14
    //Same thing happens when searching for movies without genres. I have named them negGenres.
    try {
        let url = `https://api.themoviedb.org/3/discover/movie?include_adult=${req.params.adult}&language=en-US&page=${req.params.page}&sort_by=${req.params.sort}&with_genres=${req.params.genres}&without_genres=${req.params.negGenres}`;
        if (req.params.year) {
            url += `&year=${req.params.year}`;
        }
        
        const response = await fetch(url, apiOptions);
        const result = await response.json();

        if (result.success === false) {
            res.status(404).json({ success: false, message: 'The resource you requested could not be found' });
        } else{
            res.json(result);
        }
    } catch (error) {
        console.error('Error connecting to API', error);
        res.status(500).send('Internal Server Error');
    }
});


// TV shows below this

router.get('/topRatedShows/:page', async (req, res) => { // Get top rated tv shows per page.
    try {
        const url = 'https://api.themoviedb.org/3/tv/top_rated?language=en-US&page='+req.params.page;
        const response = await fetch(url, apiOptions);
        const result = await response.json();
        if (result.success === false) {
            res.status(404).json({ success: false, message: 'Invalid page: Pages start at 1 and max at 500. They are expected to be an integer' });
        } else {
            res.json(result);
        }
    } catch (error) {
        console.error('Error connecting to API', error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/searchShow/:query/:page', async (req, res) => { // Search TV shows by name.
    try {
        const url = 'https://api.themoviedb.org/3/search/tv?query='+ req.params.query +'&language=en-US&page='+ req.params.page;
        const response = await fetch(url, apiOptions);
        const result = await response.json();
        if (result.success === false) {
            res.status(404).json({ success: false, message: 'The resource you requested could not be found' });
        } else{
            res.json(result);
        }

    } catch (error) {
        console.error('Error connecting to API', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/tvShowId/:id', async (req, res) => { // Gets tv show using the id
    try {
        const url = 'https://api.themoviedb.org/3/tv/'+ req.params.id +'?language=en-US';
        const response = await fetch(url, apiOptions);
        const result = await response.json();
        if (result.success === false) {
            res.status(404).json({ success: false, message: 'Series not found' });
        } else{
            res.json(result);
        }
    } catch (error) {
        console.error('Error connecting to API', error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/advancedSeries/:adult/:page/:genres/:negGenres/:year?', async (req, res) => { // Search Series shows by everything.
    //Search using adult, genres, year, without genres
    try {
        let url = `https://api.themoviedb.org/3/discover/tv?include_adult=${req.params.adult}&include_null_first_air_dates=false&language=en-US&page=${req.params.page}&sort_by=${req.params.sort}&with_genres=${req.params.genres}&without_genres=${req.params.negGenres}`;

        if (req.params.year) {
            url += `&year=${req.params.year}`;
        }
        
        const response = await fetch(url, apiOptions);
        const result = await response.json();
        if (result.success === false) {
            res.status(404).json({ success: false, message: 'The resource you requested could not be found' });
        } else{
            res.json(result);
        }
    } catch (error) {
        console.error('Error connecting to API', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;