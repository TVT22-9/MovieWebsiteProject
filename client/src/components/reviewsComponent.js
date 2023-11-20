import { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';

const ReviewsComponent = () => {

    return (
        <div>
            <ReviewsList />
            <AddReviewWindow />
            <DeleteAllReviewsButton />
        </div>
    )
}

/* Gets all the reviews in the database and returns them as an array of objects */
function GetAllReviews() {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/review')
            .then(response => setData(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);
    return data;
}

/* Prints all the reviews in the database in a list
 * Each review has a button to delete it and a button to update it */
function ReviewsList() {
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
                            <button onClick={async () => {
                                let response = await axios.delete('http://localhost:3001/review/idreview/' + review.idreview);
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
                                        });
                                        console.log(response);
                                    }}>Update Review</button>
                                </div>
                            </Popup>
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
function AddReviewWindow() {
    return (
        <Popup trigger={<button> Add Review </button>} modal>
            <div>
                <h2>Add Review</h2>
                <label>User ID: </label>
                <input type="" name="iduser" />
                <label>Movie ID: </label>
                <input type="" name="idmovie" />
                <label>Series ID: </label>
                <input type="" name="idseries" />
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
                        iduser: document.getElementsByName("iduser")[0].value,
                        idmovie: document.getElementsByName("idmovie")[0].value,
                        idseries: document.getElementsByName("idseries")[0].value,
                        reviewcontent: document.getElementsByName("reviewcontent")[0].value,
                        score: document.getElementsByName("score")[0].value
                    });
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
            let response = await axios.delete('http://localhost:3001/review');
            console.log(response);
        }}>Delete All Reviews</button>
    )
}

export default ReviewsComponent;