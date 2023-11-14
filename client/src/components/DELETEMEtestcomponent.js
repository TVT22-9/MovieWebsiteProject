import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/user') 
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Connection Test</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default TestComponent;