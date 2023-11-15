import React, { useState, useEffect } from 'react';

const fetch = require('node-fetch');

const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';
const apiKey = process.env.TMBD_API_RAT;
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YmJjMjE5NmY2ZmYzYThkZDBjMzhjYTlhOTI4Yjg5OCIsInN1YiI6IjY1NGExODhhZmQ0ZjgwMDExZWQyYTE3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7w220KjFdm00xXHzR7ZDehTEaPpiaVhN-TIKXu1j1sM'
    }
  };


const ApiTestComponent = () => {
    const [apiData, setApiData] = useState(null);
    let dataTest= {"key": "value"};
    async function getData(){
        try {
            const response = await fetch(url, options);
            const json = await response.json();
            console.log(json);
            setApiData(json);
        } catch (err) {
            console.error('error:', err);
        }        
    }
    useEffect(() => {
        getData()
    },[])

    return (
        <div>
            <h1>Connection Test</h1>
            {apiData ? (
                <pre>{JSON.stringify(apiData, null, 2)}</pre>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};  
export default ApiTestComponent;
