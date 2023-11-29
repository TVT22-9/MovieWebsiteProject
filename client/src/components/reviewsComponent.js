import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';
import { userData } from './Signals';

const ReviewsComponent = () => {

    return (
        <div>
            <h2>Reviews</h2>
            {ReviewsList(null, null, null)}
        </div>
    )
}

/* Prints reviews based on if username, idmovie or idseries is given
 * The logged in user can edit and delete their own reviews
 * Call in a component like this: {ReviewsList(uname, idm ids)} Set the values you are not using to null like so {ReviesList(userData.value?.private, null, null)} */
export function ReviewsList(uname, idm, ids) {
    const [reviews, setReviews] = useState(null);
    const [titles, setTitles] = useState({});
    const [sortBy, setSortBy] = useState('newest'); // Sorts by newest by default
    const [UpdateList, setUpdateList] = useState(true); // Used to update the list when a review is deleted or updated

    useEffect(() => {
        if (UpdateList) {
            let url;
            if (uname) { /* Check if username is given */
                url = 'http://localhost:3001/review/username/' + uname;
            } else if (idm) { /* Check if idmovie is given */
                url = 'http://localhost:3001/review/idmovie/' + idm;
            } else if (ids) { /* Check if idseries is given */
                url = 'http://localhost:3001/review/idseries/' + ids;
            } else { /* If no username, idmovie or idseries is given, get all reviews */
                url = 'http://localhost:3001/review';
            }
            axios.get(url)
                .then(async response => {
                    if (response.status === 200) {
                        const reviews = response.data;
                        const titles = await Promise.all(reviews.map(review => {
                            const id = review.idmovie || review.idseries;
                            return (review.idmovie ? getMovieTitle(review.idmovie) : getSeriesTitle(review.idseries))
                                .then(title => ({ id, title }));
                        }));
                        setReviews(response.data);
                        setTitles(titles.reduce((acc, { id, title }) => ({ ...acc, [id]: title }), {}));
                        setUpdateList(false);
                    } else {
                        alert("Something went wrong fetching the reviews");
                    }
                })
                .catch(error => {
                    console.error('Error fetching reviews:', error);
                })
                .finally(() => {
                    setUpdateList(false);
                });
        }
    }, [UpdateList, uname, idm, ids]);


    /* Get movie title */
    const getMovieTitle = async (idmovie) => {
        let response = await axios.get('http://localhost:3001/api/movieId/' + idmovie)
            .catch(error => console.error('Error fetching movie title:', error));
        return response.data.title;
    }

    /* Get series title */
    const getSeriesTitle = async (idseries) => {
        let response = await axios.get('http://localhost:3001/api/tvShowId/' + idseries)
            .catch(error => console.error('Error fetching series title:', error));
        return response.data.name;
    }

    /* Loop and print stars base on score */
    const printStars = (score) => {
        let stars = '';

        for (let i = 0; i < 5; i++) {
            stars += i < score ? '⭐' : '☆';
        }
        return stars;
    }

    /* Sort reviews by time, score or title */
    const sortReviews = (reviews) => {
        switch (sortBy) {
            case 'newest':
                return reviews.sort((a, b) => b.reviewtimestamp.localeCompare(a.reviewtimestamp));
            case 'oldest':
                return reviews.sort((a, b) => a.reviewtimestamp.localeCompare(b.reviewtimestamp));
            case 'score':
                return reviews.sort((a, b) => b.score - a.score);
            case 'title':
                return reviews.sort((a, b) => titles[a.idmovie || a.idseries].localeCompare(titles[b.idmovie || b.idseries]));
            default:
                return reviews;
        }
    }

    if (reviews === null) {
        return (
            <div>
                <p>Loading reviews...</p>
            </div>
        )
    } else if (reviews.length > 0) {
        const sortedReviews = sortReviews(reviews);

        return (
            <div className="reviews-list">
                <div className="reviews-sort">
                    <label>Sort By:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Most recent</option>
                        <option value="oldest">Oldest</option>
                        <option value="score">Score</option>
                        <option value="title">Title</option>
                    </select>
                </div>
                {sortedReviews.map((review) => { /* Loop through all reviews */
                    const id = review.idmovie || review.idseries;
                    return (
                        <div key={review.idreview} className="reviews-item">
                            <ul>
                                <h3>{titles[id]}</h3>
                                <h3>{printStars(review.score)}</h3>
                                <p>{review.reviewcontent}</p>
                                <p>{review.username} {review.reviewtimestamp}</p>
                                {review.username === userData.value?.private && ( /* Check if logged in user is the same as the user who made the review */
                                    <>
                                        <div className="reviews-actions">
                                            <button onClick={async () => {
                                                let response = await axios.delete('http://localhost:3001/review/idreview/' + review.idreview)
                                                    .catch(error => console.error('Error deleting review', error));
                                                console.log(response);
                                                if (response.status === 200) {
                                                    setUpdateList(true);
                                                } else {
                                                    alert("Something went wrong deleting the review");
                                                }
                                            }} className="reviews-button">Delete Review</button>

                                            <Popup trigger={<button> Update Review </button>} modal>
                                                {close => (
                                                    <div className="reviews-update-popup">
                                                        <h2>Update Review</h2>
                                                        <label>Review: </label>
                                                        <input name="reviewcontentupdate" defaultValue={review.reviewcontent} />
                                                        <select name="scoreupdate" defaultValue={review.score}>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>
                                                        </select>

                                                        <button onClick={async () => {
                                                            let response = await axios.put('http://localhost:3001/review', {
                                                                idreview: review.idreview,
                                                                reviewcontent: document.getElementsByName("reviewcontentupdate")[0].value,
                                                                score: document.getElementsByName("scoreupdate")[0].value
                                                            })
                                                                .catch(error => console.error('Error updating review', error));
                                                            console.log(response);
                                                            if (response.status === 200) {
                                                                setUpdateList(true);
                                                                close();
                                                            } else {
                                                                alert("Something went wrong updating the review");
                                                                close();
                                                            }
                                                        }} className="reviews-button">Update Review</button>
                                                    </div>
                                                )}
                                            </Popup>
                                        </div>
                                    </>
                                )}
                            </ul>
                        </div>
                    )
                }
                )}
            </div>
        )
    } else {
        return (
            <div>
                <p>No reviews found</p>
            </div>
        )
    }
}

/* A button that opens a popup window to add a review */
export function AddReviewWindow(idmovie, idseries) {
    return (
        <Popup trigger={<button> Add Review </button>} modal>
            {close => (
                <div className="reviews-add-popup">
                    <h2>Add Review</h2>
                    <label>Review: </label>
                    <input name="reviewcontent" placeholder="Write your review here" />
                    <select name="score">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <button onClick={async () => {
                        try {
                            const response = await axios.post('http://localhost:3001/review', {
                                username: userData.value?.private,
                                idmovie: idmovie,
                                idseries: idseries,
                                reviewcontent: document.getElementsByName("reviewcontent")[0].value,
                                score: document.getElementsByName("score")[0].value
                            });

                            if (response.status === 200) {
                                window.location.reload(); /* Couldn't get the list to update from here, so just reload the page */
                            }
                        } catch (error) {
                            console.error('Error adding review', error);
                            alert("You have already made a review for this movie/series");
                        } finally {
                            close();
                        }
                    }} className="reviews-button">Add Review</button>
                </div>
            )}
        </Popup>
    )
}

export default ReviewsComponent;