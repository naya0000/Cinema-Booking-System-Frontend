import React, { useState } from 'react';
import axios from 'axios';
import { fetchMovieByQuery } from '@/services/api';
import { Search } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
interface Movie {
    id: number;
    title: string;
    description: string;
    releaseDate: string;
    status: string;
    genre: string;
    level: string;
    // seats: Seat[];
    // sessions: Session[];
    // orders: CustomerOrder[];
}
interface Props {
    onSearch: (query: string) => void;
}
function MovieSearch({ onSearch }: Props) {
    const [query, setQuery] = useState('');
    //const [results, setResults] = useState([]);

    const handleSearch = async () => {
        onSearch(query);
    };

    return (
        <div style={{ marginTop: '3rem' }}>
            <TextField
                type="text"
                placeholder="Search for movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleSearch}>
                                <Search />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </div>
    );
}

export default MovieSearch;
