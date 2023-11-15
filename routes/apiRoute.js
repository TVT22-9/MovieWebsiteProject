const express = require('express');
const apiOptions = require('../api_tools/api_options'); 
const router = express.Router();

// Movies below this
router.get('/topRated/:page', async (req, res) => { // Get top rated movies per page.
    try {
        const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page='+req.params.page;
        const response = await fetch(url, apiOptions);
        const result = await response.json();
        res.json(result);
    } catch (error) {
      console.error('Error connecting to API', error);
      res.status(500).send('Internal Server Error');
    }
});
router.get('/movieId/:id', async (req, res) => { // Gets movie using the id
    try {
        const url = 'https://api.themoviedb.org/3/movie/'+ req.params.id +'?language=en-US';
        const response = await fetch(url, apiOptions);
        const result = await response.json();
        res.json(result);
    } catch (error) {
      console.error('Error connecting to API', error);
      res.status(500).send('Internal Server Error');
    }
});
router.get('/searchMovie/:query/:page', async (req, res) => { // Get top rated movies per page.
    try {
        const url = 'https://api.themoviedb.org/3/search/movie?query='+ req.params.query +'&language=en-US&page='+ req.params.page;
        const response = await fetch(url, apiOptions);
        const result = await response.json();
        res.json(result);
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
        res.json(result);
    } catch (error) {
      console.error('Error connecting to API', error);
      res.status(500).send('Internal Server Error');
    }
});
router.get('/tvShowId/:id', async (req, res) => { // Gets movie using the id
    try {
        const url = 'https://api.themoviedb.org/3/tv/'+ req.params.id +'?language=en-US';
        const response = await fetch(url, apiOptions);
        const result = await response.json();
        res.json(result);
    } catch (error) {
      console.error('Error connecting to API', error);
      res.status(500).send('Internal Server Error');
    }
});
module.exports = router;