import React, { useState } from 'react';
import axios from 'axios';
import { fetchMovieByQuery } from '@/services/api';
interface Movie {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  status:string;
  genre:string;
  level:string;
  // seats: Seat[];
  // sessions: Session[];
  // orders: CustomerOrder[];
}
interface Props{
    onSearch: (query: string) => void;
  }
function MovieSearch({ onSearch}: Props ) {
    const [query, setQuery] = useState('');
    //const [results, setResults] = useState([]);

    const handleSearch = async () => {
        onSearch(query);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search for movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            {/* <ul>
                {results.map((movie) => (
                    <li key={movie}>{movie}</li>
                ))}
            </ul> */}
        </div>
    );
}

export default MovieSearch;
