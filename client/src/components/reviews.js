import { effect, signal } from '@preact/signals-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const reviewData = signal(GetReviews());

async function GetReviews() {
    return (axios.get('http://localhost:3001/review')
        .then(response => response.data)
        .catch(error => console.error('Error fetching data:', error))
    );
}




const ReviewsComponent = () => {

    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/review')
            .then(response => setData(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>Reviews</h1>

            {data ? (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>Loading data...</p>
            )}

            <h2>Add Review</h2>
            <label>User ID: </label>
            <input type="int" name="iduser" />
            <label>Movie ID: </label>
            <input type="int" name="idmovie" />
            <label>Review: </label>
            <input type="text" name="reviewcontent" />
            <label>Score: </label>
            <input type="smallint" name="score" />
            <button onClick={async () => {
                let response = await axios.post('http://localhost:3001/review', {
                    iduser: document.getElementsByName("iduser")[0].value,
                    idmovie: document.getElementsByName("idmovie")[0].value,
                    reviewcontent: document.getElementsByName("reviewcontent")[0].value,
                    score: document.getElementsByName("score")[0].value
                });
                console.log(response);
            }}>Add Review</button>

            <h2>Delete Review</h2>
            <label>Review ID: </label>
            <input type="int" name="idreview" />
            <button onClick={async () => {
                let response = await axios.delete('http://localhost:3001/review/idreview/' + document.getElementsByName("idreview")[0].value);
                console.log(response);
            }}>Delete Review</button>

            <h2>Update Review</h2>
            <label>Review ID: </label>
            <input type="int" name="idreviewupdate" />
            <label>Review: </label>
            <input type="text" name="reviewcontentupdate" />
            <label>Score: </label>
            <input type="smallint" name="scoreupdate" />
            <button onClick={async () => {
                let response = await axios.put('http://localhost:3001/review', {
                    idreview: document.getElementsByName("idreviewupdate")[0].value,
                    reviewcontent: document.getElementsByName("reviewcontentupdate")[0].value,
                    score: document.getElementsByName("scoreupdate")[0].value
                });
                console.log(response);
            }}>Update Review</button>
        </div>
    )
}


export default ReviewsComponent;