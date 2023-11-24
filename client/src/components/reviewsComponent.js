import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';
import { jwtToken, userData } from './Signals';

const ReviewsComponent = () => {

    return (
        <div>
            <ReviewsList />
        </div>
    )
}

/* Gets all the reviews in the database */
export function GetAllReviews() {
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
    const [reviews, setReviews] = useState(null);
    const [titles, setTitles] = useState({});
    const [sortBy, setSortBy] = useState('newest'); // Sorts by newest by default
    const [isOpen, setIsOpen] = useState(false);
    const [UpdateList, setUpdateList] = useState(true); // Used to update the list when a review is deleted or updated

    useEffect(() => {
        if (UpdateList) {
            axios.get('http://localhost:3001/review')
                .then(response => {
                    setReviews(response.data);
                    setUpdateList(false);
                })
                .catch(error => console.error('Error fetching reviews:', error));
        }
    }, [UpdateList]);


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

    if (reviews) {
        const sortedReviews = sortReviews(reviews);

        return (
            <div className="reviews-list">
                <h2>Reviews</h2>
                <div className="reviews-sort">
                    <label>Sort By:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Most recent</option>
                        <option value="oldest">Oldest</option>
                        <option value="score">Score</option>
                        <option value="title">Title</option>
                    </select>
                </div>
                {sortedReviews.map((review) => {
                    const id = review.idmovie || review.idseries;
                    if (!titles[id]) {
                        (review.idmovie ? getMovieTitle(review.idmovie) : getSeriesTitle(review.idseries))
                            .then(title => setTitles(prevTitles => ({ ...prevTitles, [id]: title })));
                    }
                    return (
                        <div key={review.idreview} className="reviews-item">
                            <ul>
                                <h3>{titles[id]}</h3>
                                <h3>{printStars(review.score)}</h3>
                                <p>{review.reviewcontent}</p>
                                <p>{review.username} {review.reviewtimestamp}</p>
                                {review.username === userData.value?.private && (
                                    <>
                                        <div className="reviews-actions">
                                            <button onClick={async () => {
                                                let response = await axios.delete('http://localhost:3001/review/idreview/' + review.idreview)
                                                    .catch(error => console.error('Error deleting review', error));
                                                console.log(response);
                                                setUpdateList(true);
                                            }} className="reviews-button">Delete Review</button>
                                            {/* Popup does not close when review is updated, will fix later */}
                                            <Popup open={isOpen} onClose={() => setIsOpen(false)} trigger={<button onClick={() => setIsOpen(true)}> Update Review </button>} modal>
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
                                                        setIsOpen(false);
                                                        setUpdateList(true);
                                                    }} className="reviews-button">Update Review</button>
                                                </div>
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
                <h2>Reviews</h2>
                <p>Loading reviews...</p>
            </div>
        )
    }
}

/* A button that opens a popup window to add a review */
export function AddReviewWindow(idmovie, idseries) {
    return (
        <Popup trigger={<button> Add Review </button>} modal>
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
                    let response = await axios.post('http://localhost:3001/review', {
                        username: userData.value?.private,
                        idmovie: idmovie,
                        idseries: idseries,
                        reviewcontent: document.getElementsByName("reviewcontent")[0].value,
                        score: document.getElementsByName("score")[0].value
                    })
                        .catch(error => console.error('Error posting review', error));
                    console.log(response);
                }} className="reviews-button">Add Review</button>
            </div>
        </Popup>
    )
}

export default ReviewsComponent;
