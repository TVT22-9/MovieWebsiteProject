import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { parseString } from 'xml2js';
import { jwtToken, userData } from "./Signals";
import Popup from 'reactjs-popup';

//A function that can be used to get a list of the news titles which can then be used to call the main NewsComponent to get all data of certain article.
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

// Gets news with the title/query. If returnMany is true it searches for all articles with that text while if false will only return the only one.
function NewsComponent({ filterTitle, returnMany }) {
    const [newsData, setNewsData] = useState(null);
    const [userGroups, setUserGroups] = useState(null);
    const [stateRefresh, setStateRefresh] = useState('0');

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

                    }
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();

        const fetchGroups = async () => {
            try {
                const databaseData = await axios.get('http://localhost:3001/groups/groupByUser/' + userData.value?.userid);
                setUserGroups(databaseData.data.result);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        if (jwtToken.value.length > 0) {
            fetchGroups();
        };
    }, [stateRefresh]);

    async function updateGroupSettings(group, article) {
        const title = article;

        if (group.groupsettings.news) {
            const newsArray = group.groupsettings.news.map(String); // Convert to strings

            // If the article doesn't exist, add it to the news array. If it does exist delete it.
            if (newsArray.includes(String(title))) {
                // If the article exists, remove it from the news array
                group.groupsettings.news = group.groupsettings.news.filter(
                    (item) => String(item) !== String(title)
                );
            } else {
                // If the article doesn't exist, add it to the news array
                group.groupsettings.news.push(title);
            }
        } else {
            group.groupsettings.news = [];
            group.groupsettings.news.push(article);

        }

        let name = group.groupname
        let settings = group.groupsettings;
        const response = await axios.put('http://localhost:3001/groups/groupSettingsUpdate/', {
            groupName: name,
            settings: settings
        });
        setStateRefresh((prevState) =>
            prevState === 0 ? 1 : 0
        );

    }

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
                                    {jwtToken.value.length > 0 ? (
                                        <Popup trigger={<button className='newsGroupButton'> Add to group </button>} modal>
                                            <div className='advancedSearch'>
                                                <h2>Add or remove this article from following groups:.</h2>
                                                {userGroups && userGroups.map((group) => (
                                                    <li key={group.groupname}>
                                                        <strong>{group.groupname}</strong>
                                                        <button onClick={() => updateGroupSettings(group, article.Title)}>
                                                            {group.groupsettings.news && group.groupsettings.news.flat().includes(String(article.Title))
                                                                ? 'Remove from group'
                                                                : 'Add to group'
                                                            }
                                                        </button>

                                                    </li>
                                                ))}
                                            </div>
                                        </Popup>
                                    ) : (
                                        <p>Login to add to group</p>
                                    )}
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