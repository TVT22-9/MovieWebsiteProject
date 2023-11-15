const pgPool = require('./connection.js');


// All the SQL queries for the reviews table
const sql = {
    GET_ALL_REVIEWS: 'SELECT * FROM reviews',
    GET_REVIEW_BY_USER_ID: 'SELECT * FROM reviews WHERE iduser = $1',
    GET_REVIEW_BY_MOVIE_ID: 'SELECT * FROM reviews WHERE idmovie = $1',
    GET_REVIEW_BY_REVIEW_ID: 'SELECT * FROM reviews WHERE idreview = $1',
    ADD_REVIEW: 'INSERT INTO reviews (iduser, idmovie, reviewcontent, score, reviewtimestamp) VALUES ($1, $2, $3, $4, NOW())',
    DELETE_REVIEW_BY_REVIEW_ID: 'DELETE FROM reviews WHERE idreview = $1',
    DELETE_REVIEW_BY_USER_ID: 'DELETE FROM reviews WHERE iduser = $1',
    DELETE_REVIEW_BY_MOVIE_ID: 'DELETE FROM reviews WHERE idmovie = $1',
    DELETE_ALL_REVIEWS: 'DELETE FROM reviews',
    UPDATE_REVIEW_BY_REVIEW_ID: 'UPDATE reviews SET reviewcontent = $1, score = $2 WHERE idreview = $3',
}

/*Get all reviews*/
async function GetAllReviews() {
    let result = await pgPool.query(sql.GET_ALL_REVIEWS);
    return result.rowCount > 0 ? result.rows : null;
}

/*Get all reviews by a specific user using iduser*/
async function GetReviewByUserId(iduser) {
    let result = await pgPool.query(sql.GET_REVIEW_BY_USER_ID, [iduser]);
    return result.rowCount > 0 ? result.rows : null;
}

/*Get all reviews for a specific movie using idmovie*/
async function GetReviewByMovieId(idmovie) {
    let result = await pgPool.query(sql.GET_REVIEW_BY_MOVIE_ID, [idmovie]);
    return result.rowCount > 0 ? result.rows : null;
}

/*Get a specific review using idreview*/
async function GetReviewByReviewId(idreview) {
    let result = await pgPool.query(sql.GET_REVIEW_BY_REVIEW_ID, [idreview]);
    return result.rowCount > 0 ? result.rows : null;
}

/* Adds a review to the database. Needs the following parameters:
    iduser: the id of the user who wrote the review
    idmovie: the id of the movie being reviewed
    reviewcontent: the review itself
    score: a score between 1 and 5
*/
async function AddReview(iduser, idmovie, reviewcontent, score) {
    console.log(iduser, idmovie, reviewcontent, score);
    let result = await pgPool.query(sql.ADD_REVIEW, [iduser, idmovie, reviewcontent, score]);
    return result.rowCount > 0 ? result.rows : null;
}

/* Deletes all reviews made by a user*/
async function DeleteReviewByUserId(iduser) {
    let result = await pgPool.query(sql.DELETE_REVIEW_BY_USER_ID, [iduser]);
    return result.rowCount > 0 ? result.rows : null;
}

/* Deletes all reviews for a movie*/
async function DeleteReviewByMovieId(idmovie) {
    let result = await pgPool.query(sql.DELETE_REVIEW_BY_MOVIE_ID, [idmovie]);
    return result.rowCount > 0 ? result.rows : null;
}

/* Deletes a specific review*/
async function DeleteReviewByReviewId(idreview) {
    let result = await pgPool.query(sql.DELETE_REVIEW_BY_REVIEW_ID, [idreview]);
    return result.rowCount > 0 ? result.rows : null;
}

/* Deletes all reviews*/
async function DeleteAllReviews() {
    let result = await pgPool.query(sql.DELETE_ALL_REVIEWS);
    return result.rowCount > 0 ? result.rows : null;
}

/* Used to edit the content and score of a review */
async function UpdateReview(reviewcontent, score, idreview) {
    console.log(reviewcontent, score, idreview);
    let result = await pgPool.query(sql.UPDATE_REVIEW_BY_REVIEW_ID, [reviewcontent, score, idreview]);
    console.log(result);
    return result.rowCount > 0 ? result.rows : null;
}

module.exports = {
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
}