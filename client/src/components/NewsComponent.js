import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { parseString } from 'xml2js';

function NewsComponent() {
    const [newsData, setNewsData] = useState(null);

    useEffect(() => { 
        const fetchData = async () => {
            try {
                const response = await axios.get('https://www.finnkino.fi/xml/News/');

                parseString(response.data, { trim: true }, (err, result) => {
                    if (err) {
                        console.error('Error parsing XML:', err);
                    } else {
                        const newsArticles = result.News.NewsArticle;
                        setNewsData(newsArticles);
                        console.log(newsArticles);
                    }
                });
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
        fetchData();
    }, []);

    return (
      <div>
        {newsData ? (
            <pre>
                {newsData.map((article, index) => (
                    <div key={index}>
                        <h2>{article.Title[0]}</h2>
                        <p>{article.HTMLLead[0]}</p>
                        <a href={article.ArticleURL[0]} target="_blank" rel="noopener noreferrer">Read More</a>
                        <hr />
                    </div>
                ))}
            </pre>
        ) : (
            <p>Loading data...</p>
        )}
        </div>
    );
}
export default NewsComponent;