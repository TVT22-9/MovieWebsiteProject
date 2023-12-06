import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { parseString } from 'xml2js';
export function extractNewsTitles() {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get('https://www.finnkino.fi/xml/News/');

            parseString(response.data, { trim: true }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    const newsTitles = result.News.NewsArticle.map(article => article.Title[0]);
                    resolve(newsTitles);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

// Gets news with the title/query. If nothing is given gives all news.
function NewsComponent({ filterTitle, returnMany }) {
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

    const filteredNewsData = newsData && filterTitle
        ? newsData.filter(article => article.Title[0].includes(filterTitle))
        : newsData;
    
    const firstArticle = filteredNewsData && filteredNewsData.length > 0
        ? filteredNewsData[0]
        : null;

    return (
        <div>
            {returnMany ? (
                <pre>
                    {filteredNewsData ? (
                        <pre>
                            {filteredNewsData.map((article, index) => (
                                <div className='NewsArticle' key={index}>
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
                </pre>
            ) : (
                <pre>
                    {firstArticle ? (
                        <pre>

                            <div className='NewsArticle' key={0}>

                                <h2>{filteredNewsData[0].Title[0]}</h2>
                                <p>{filteredNewsData[0].HTMLLead[0]}</p>
                                <a href={filteredNewsData[0].ArticleURL[0]} target="_blank" rel="noopener noreferrer">Read More</a>
                                <hr />
                            </div>
                        </pre>
                    ) : (
                        <p>Loading data...</p>
                    )}
                </pre>
            )}
        </div>
    );
}

export default NewsComponent;