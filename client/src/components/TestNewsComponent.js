import React, { useState, useEffect } from 'react';
import NewsComponent from './NewsComponent';
import { extractNewsTitles } from './NewsComponent';

function OtherComponent() {
    const [newsData, setNewsData] = useState(null);
    useEffect(() => {
        const fetchNewsTitles = async () => {
            try {
                const newsTitles = await extractNewsTitles();
                console.log('News Titles:', newsTitles);
                // Do something with the news titles
                setNewsData("Leffauutiset: Nälkäpeli-ohjaaja katuu Matkijanärhen jakamista kahteen osaan");
            } catch (error) {
                console.error('Error fetching news titles:', error);
            }
        };

        fetchNewsTitles();
    }, []);

    return (
        <div>
            {newsData ? (
                <pre>
                    <NewsComponent filterTitle= {newsData} />

                </pre>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
}

export default OtherComponent;