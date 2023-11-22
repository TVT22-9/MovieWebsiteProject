const pgPool = require('./connection.js');

/* All the SQL queries for the reviews table */
const sql = {
    GET_ALL_REVIEWS: 'SELECT reviews.idreview, reviews.iduser, reviews.idmovie, reviews.idseries, reviews.reviewcontent, reviews.score, TO_CHAR(reviews.reviewtimestamp, \'DD.MM.YYYY HH24.MI\') AS reviewtimestamp, webusers.username FROM reviews INNER JOIN webusers ON reviews.iduser = webusers.iduser ORDER BY reviews.reviewtimestamp DESC',
    GET_REVIEW_BY_USER_ID: 'SELECT review.idreview, review.iduser, review.idmovie, review.idseries, review.reviewcontent, review.score, TO_CHAR(review.reviewtimestamp, \'DD.MM.YYYY HH24.MI\') AS reviewtimestamp, webusers.username FROM reviews INNER JOIN webusers ON reviews.iduser = webusers.iduser WHERE reviews.iduser = $1 ORDER BY reviews.reviewtimestamp DESC',
    GET_REVIEW_BY_USERNAME: 'SELECT review.idreview, review.iduser, review.idmovie, review.idseries, review.reviewcontent, review.score, TO_CHAR(review.reviewtimestamp, \'DD.MM.YYYY HH24.MI\') AS reviewtimestamp, webusers.username FROM reviews INNER JOIN webusers ON reviews.iduser = webusers.iduser WHERE webusers.username = $1 ORDER BY reviews.reviewtimestamp DESC',
    GET_REVIEW_BY_MOVIE_ID: 'SELECT * FROM reviews WHERE idmovie = $1',
    GET_REVIEW_BY_SERIES_ID: 'SELECT * FROM reviews WHERE idseries = $1',
    GET_REVIEW_BY_REVIEW_ID: 'SELECT * FROM reviews WHERE idreview = $1',
    ADD_REVIEW: 'call addreview($1, $2, $3, $4, $5)',
    DELETE_REVIEW_BY_REVIEW_ID: 'DELETE FROM reviews WHERE idreview = $1',
    DELETE_REVIEW_BY_USER_ID: 'DELETE FROM reviews WHERE iduser = $1',
    DELETE_REVIEW_BY_MOVIE_ID: 'DELETE FROM reviews WHERE idmovie = $1',
    DELETE_REVIEW_BY_SERIES_ID: 'DELETE FROM reviews WHERE idseries = $1',
    DELETE_ALL_REVIEWS: 'DELETE FROM reviews',
    UPDATE_REVIEW_BY_REVIEW_ID: 'UPDATE reviews SET reviewcontent = $1, score = $2 WHERE idreview = $3',
}

/* Get all reviews */
async function GetAllReviews() {
    let result = await pgPool.query(sql.GET_ALL_REVIEWS);
    return result.rowCount > 0 ? result.rows : null;
}

/* Get all reviews by a specific user using iduser */
async function GetReviewByUserId(iduser) {
    let result = await pgPool.query(sql.GET_REVIEW_BY_USER_ID, [iduser]);
    return result.rowCount > 0 ? result.rows : null;
}

/* Get all reviews by a specific user using username */
async function GetReviewByUsername(username) {
    let result = await pgPool.query(sql.GET_REVIEW_BY_USER_ID, [username]);
    return result.rowCount > 0 ? result.rows : null;
}

/* Get all reviews for a specific movie using idmovie */
async function GetReviewByMovieId(idmovie) {
    let result = await pgPool.query(sql.GET_REVIEW_BY_MOVIE_ID, [idmovie]);
    return result.rowCount > 0 ? result.rows : null;
}

/* Get all reviews for a specific series using idseries */
async function GetReviewBySeriesId(idseries) {
    let result = await pgPool.query(sql.GET_REVIEW_BY_SERIES_ID, [idseries]);
    return result.rowCount > 0 ? result.rows : null;
}

/* Get a specific review using idreview */
async function GetReviewByReviewId(idreview) {
    let result = await pgPool.query(sql.GET_REVIEW_BY_REVIEW_ID, [idreview]);
    return result.rowCount > 0 ? result.rows : null;
}

/* Adds a review to the database. Needs the following parameters:
    iduser: the id of the user who wrote the review
    idmovie: the id of the movie being reviewed
    idseries: the id of the series being reviewed
    reviewcontent: the review itself
    score: a score between 1 and 5
*/
async function AddReview(username, idmovie, idseries, reviewcontent, score) {
    console.log(username, idmovie, idseries, reviewcontent, score);
    let result = await pgPool.query(sql.ADD_REVIEW, [username, idmovie, idseries, reviewcontent, score]);
    return result.rowCount > 0 ? result.rows : null;
}

/* Deletes all reviews made by a user */
async function DeleteReviewByUserId(iduser) {
    let result = await pgPool.query(sql.DELETE_REVIEW_BY_USER_ID, [iduser]);
    return result.rowCount > 0 ? result.rows : null;
}

/* Deletes all reviews for a movie */
async function DeleteReviewByMovieId(idmovie) {
    let result = await pgPool.query(sql.DELETE_REVIEW_BY_MOVIE_ID, [idmovie]);
    return result.rowCount > 0 ? result.rows : null;
}

/* Deletes all reviews for a series */
async function DeleteReviewBySeriesId(idseries) {
    let result = await pgPool.query(sql.DELETE_REVIEW_BY_SERIES_ID, [idseries]);
    return result.rowCount > 0 ? result.rows : null;
}

/* Deletes a specific review */
async function DeleteReviewByReviewId(idreview) {
    let result = await pgPool.query(sql.DELETE_REVIEW_BY_REVIEW_ID, [idreview]);
    return result.rowCount > 0 ? result.rows : null;
}

/* Deletes all reviews */
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
}