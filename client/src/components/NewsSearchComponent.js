import React, { useState, useEffect } from 'react';
import NewsComponent from './NewsComponent';
import { extractNewsTitles } from './NewsComponent';

function OtherComponent() {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchNewsTitles = async () => {
            try {
                const newsTitles = await extractNewsTitles();
                console.log('News Titles:', newsTitles);
                // Do something with the news titles
            } catch (error) {
                console.error('Error fetching news titles:', error);
            }
        };

        fetchNewsTitles();
    }, [searchQuery]);

    const handleSearch = (query) => {
        setSearchQuery(query);
    }


    return (
        <div>
            <input
                className='search'
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
            />

            <NewsComponent filterTitle= {searchQuery} returnMany= {true} />

        </div>
    );
}

export default OtherComponent;