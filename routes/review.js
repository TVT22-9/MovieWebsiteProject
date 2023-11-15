require('dotenv').config();
const router = require('express').Router();
const {
    GetAllReviews,
    GetReviewByUserId,
    GetReviewByMovieId,
    GetReviewByReviewId,
    AddReview,
    DeleteReviewByUserId,
    DeleteReviewByMovieId,
    DeleteReviewByReviewId,
    DeleteAllReviews,
    UpdateReview
} = require('../database_tools/reviews_db.js');

/* Route for getting all reviews */
router.get('/', async (req, res) => {
    try {
        const response = await GetAllReviews();
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(400).json('Something went wrong');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Something went wrong');
    }
});

/* Route for getting reviews by user id */
router.get('/iduser/:iduser', async (req, res) => {
    try {
        const response = await GetReviewByUserId(req.params.iduser);
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(400).json('Something went wrong');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Something went wrong');
    }
});

/* Route for getting reviews by movie id */
router.get('/idmovie/:idmovie', async (req, res) => {
    try {
        const response = await GetReviewByMovieId(req.params.idmovie);
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(400).json('Something went wrong');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Something went wrong');
    }
});

/* Route for getting reviews by review id */
router.get('/idreview/:idreview', async (req, res) => {
    try {
        const response = await GetReviewByReviewId(req.params.idreview);
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(400).json('Something went wrong');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Something went wrong');
    }
});

/* Route for adding a review */
router.post('/', async (req, res) => {
    try {
        const response = await AddReview(req.body.iduser, req.body.idmovie, req.body.reviewcontent, req.body.score);
        if (response) {
            res.status(200).json('Review added');
        } else {
            res.status(400).json('Something went wrong');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Something went wrong');
    }
});

/* Route for deleting a review by iduser */
router.delete('/iduser/:iduser', async (req, res) => {
    try {
        const response = await DeleteReviewByUserId(req.params.iduser);
        if (response) {
            res.status(200).json('Review(s) deleted');
        } else {
            res.status(400).json('Something went wrong');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Something went wrong');
    }
});

/* Route for deleting a review by idmovie */
router.delete('/idmovie/:idmovie', async (req, res) => {
    try {
        const response = await DeleteReviewByMovieId(req.params.idmovie);
        if (response) {
            res.status(200).json('Review(s) deleted');
        } else {
            res.status(400).json('Something went wrong');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Something went wrong');
    }
});

/* Route for deleting a review by idreview */
router.delete('/idreview/:idreview', async (req, res) => {
    try {
        const response = await DeleteReviewByReviewId(req.params.idreview);
        if (response) {
            res.status(200).json('Review(s) deleted');
        } else {
            res.status(400).json('Something went wrong');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Something went wrong');
    }
});

/* Route for deleting all reviews */
router.delete('/', async (req, res) => {
    try {
        const response = await DeleteAllReviews();
        if (response) {
            res.status(200).json('Reviews deleted');
        } else {
            res.status(400).json('Something went wrong');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Something went wrong');
    }
});

/* Route for updating a review */
router.put('/', async (req, res) => {
    try {
        const response = await UpdateReview(req.body.reviewcontent, req.body.score, req.body.idreview);
        if (response) {
            res.status(200).json('Review updated');
        } else {
            res.status(400).json('Something went wrong');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Something went wrong');
    }
});

module.exports = router;