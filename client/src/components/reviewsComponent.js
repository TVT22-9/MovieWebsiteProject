import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';
import { jwtToken, userData } from './Signals';

const ReviewsComponent = () => {

    return (
        <div>
            <ReviewsList />
            <AddReviewWindow />
            <DeleteAllReviewsButton />
        </div>
    )
}

/* Gets all the reviews in the database */
function GetAllReviews() {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/review')
            .then(response => setData(response.data))
            .catch(error => console.error('Error fetching reviews:', error));
    }, []);
    return data;
}

/* Gets all the reviews made by a specific user using username */
export function GetReviewByUsername(username) {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/review/username/' + username)
            .then(response => setData(response.data))
            .catch(error => console.error('Error fetching reviews:', error));
    }, []);
    return data;
}

/* Prints all the reviews in the database in a list
 * The logged in user can edit and delete their own reviews */
export function ReviewsList() {
    const reviews = GetAllReviews();
    if (reviews) {
        return (
            <div>
                <h2>Reviews</h2>
                {reviews.map((review) => (
                    <div key={review.idreview}>
                        <ul>
                            <li>Review ID: {review.idreview}</li>
                            <li>User ID: {review.iduser}</li>
                            <li>Movie ID: {review.idmovie}</li>
                            <li>Series ID: {review.idseries}</li>
                            <li>Review: {review.reviewcontent}</li>
                            <li>Score: {review.score}</li>
                            <li>Date: {review.reviewtimestamp}</li>
                            <li>Username: {review.username}</li>
                            {review.username === userData.value?.private && (
                                <>
                                    <button onClick={async () => {
                                        let response = await axios.delete('http://localhost:3001/review/idreview/' + review.idreview)
                                            .catch(error => console.error('Error deleting review', error));
                                        console.log(response);
                                    }}>Delete Review</button>
                                    <Popup trigger={<button> Update Review </button>} modal>
                                        <div>
                                            <h2>Update Review</h2>
                                            <label>Review: </label>
                                            <input type="text" name="reviewcontentupdate" defaultValue={review.reviewcontent} />
                                            <select name="score" defaultValue={review.score}>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </select>
                                            <button onClick={async () => {
                                                let response = await axios.put('http://localhost:3001/review', {
                                                    idreview: document.getElementsByName("idreviewupdate")[0].value,
                                                    reviewcontent: document.getElementsByName("reviewcontentupdate")[0].value,
                                                    score: document.getElementsByName("scoreupdate")[0].value
                                                })
                                                    .catch(error => console.error('Error updating review', error));
                                                console.log(response);
                                            }}>Update Review</button>
                                        </div>
                                    </Popup>
                                </>
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        )
    } else {
        return (
            <div>
                <h2>Reviews</h2>
                <p>No reviews found</p>
            </div>
        )
    }
}

/* A button that opens a popup window to add a review */
export function AddReviewWindow(idmovie, idseries, username) {
    return (
        <Popup trigger={<button> Add Review </button>} modal>
            <div>
                <h2>Add Review</h2>
                <label>Username: </label>
                <input type="" name="username" defaultValue={userData.value?.private} />
                <label>Movie ID: </label>
                <input type="" name="idmovie" defaultValue={idmovie} />
                <label>Series ID: </label>
                <input type="" name="idseries" defaultValue={idseries} />
                <label>Review: </label>
                <input type="" name="reviewcontent" />
                <label>Score: </label>
                <select name="score">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <button onClick={async () => {
                    let response = await axios.post('http://localhost:3001/review', {
                        username: document.getElementsByName("username")[0].value,
                        idmovie: document.getElementsByName("idmovie")[0].value,
                        idseries: document.getElementsByName("idseries")[0].value,
                        reviewcontent: document.getElementsByName("reviewcontent")[0].value,
                        score: document.getElementsByName("score")[0].value
                    })
                        .catch(error => console.error('Error posting review', error));
                    console.log(response);
                }}>Add Review</button>
            </div>
        </Popup>
    )
}

/* A button that deletes all reviews in the database */
function DeleteAllReviewsButton() {
    return (
        <button onClick={async () => {
            let response = await axios.delete('http://localhost:3001/review')
                .catch(error => console.error('Error deleting reviews', error));
            console.log(response);
        }}>Delete All Reviews</button>
    )
}

export default ReviewsComponent;
