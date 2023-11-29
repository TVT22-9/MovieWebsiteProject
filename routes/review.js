const express = require('express');
const router = express.Router();
const {
    GetAllReviews,
    GetReviewByUserId,
    GetReviewByUsername,
    GetReviewByMovieId,
    GetReviewBySeriesId,
    GetReviewByReviewId,
    AddReview,
    DeleteReviewByUserId,
    DeleteReviewByMovieId,
    DeleteReviewBySeriesId,
    DeleteReviewByReviewId,
    DeleteAllReviews,
    UpdateReview
} = require('../database_tools/reviews_db.js');
const e = require('express');

// Parse application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }));
//used to parse the json data that houses the users ownview settings
router.use(express.json());

/* Route for getting all reviews */
router.get('/', async (req, res) => {
    try {
        const response = await GetAllReviews();
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(200).json([])
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
});

/* Route for getting reviews by user id */
router.get('/iduser/:iduser', async (req, res) => {
    try {
        const response = await GetReviewByUserId(req.params.iduser);
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(200).json([])
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
});

/* Route for getting reviews by username */
router.get('/username/:username', async (req, res) => {
    try {
        const response = await GetReviewByUsername(req.params.username);
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(200).json([])
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
});

/* Route for getting reviews by movie id */
router.get('/idmovie/:idmovie', async (req, res) => {
    try {
        const response = await GetReviewByMovieId(req.params.idmovie);
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(200).json([])
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
});

/* Route for getting reviews by series id */
router.get('/idseries/:idseries', async (req, res) => {
    try {
        const response = await GetReviewBySeriesId(req.params.idseries);
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(200).json([])
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
});

/* Route for getting reviews by review id */
router.get('/idreview/:idreview', async (req, res) => {
    try {
        const response = await GetReviewByReviewId(req.params.idreview);
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(200).json([])
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
});

/* Route for adding a review */
router.post('/', async (req, res) => {
    try {
        let response = await AddReview(req.body.username, req.body.idmovie, req.body.idseries, req.body.reviewcontent, req.body.score);
        if (response) {
            res.status(400).json('Error adding review', error);
        } else {
            res.status(200).json('Review added');
        }
    } catch (error) {
        //console.error(error);
        res.status(500).json(error.message);
    }
});

/* Route for deleting reviews by iduser */
router.delete('/iduser/:iduser', async (req, res) => {
    try {
        const response = await DeleteReviewByUserId(req.params.iduser);
        if (response) {
            res.status(200).json('Review(s) deleted');
        } else {
            res.status(404).json('No reviews found to delete', error);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
});

/* Route for deleting reviews by idmovie */
router.delete('/idmovie/:idmovie', async (req, res) => {
    try {
        const response = await DeleteReviewByMovieId(req.params.idmovie);
        if (response) {
            res.status(200).json('Review(s) deleted');
        } else {
            res.status(404).json('No reviews found to delete', error);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
});

/* Route for deleting reviews by idseries */
router.delete('/idseries/:idseries', async (req, res) => {
    try {
        const response = await DeleteReviewBySeriesId(req.params.idseries);
        if (response) {
            res.status(200).json('Review(s) deleted');
        } else {
            res.status(404).json('No reviews found to delete', error);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
});

/* Route for deleting a review by idreview */
router.delete('/idreview/:idreview', async (req, res) => {
    try {
        const response = await DeleteReviewByReviewId(req.params.idreview);
        if (response) {
            res.status(200).json('Review(s) deleted');
        } else {
            res.status(404).json('No review found to delete', error);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
});

/* Route for deleting all reviews */
router.delete('/', async (req, res) => {
    try {
        const response = await DeleteAllReviews();
        if (response) {
            res.status(200).json('Reviews deleted');
        } else {
            res.status(404).json('No reviews found to delete');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
});

/* Route for updating a review */
router.put('/', async (req, res) => {
    try {
        const response = await UpdateReview(req.body.reviewcontent, req.body.score, req.body.idreview);
        if (response) {
            res.status(200).json('Review updated');
        } else {
            res.status(404).json('No review found to update', error);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
});

module.exports = router;