// import React, { useState } from 'react';
// import axios from 'axios';
// import { fetchMovieByQuery } from '@/services/api';
// import { Search } from '@mui/icons-material';
// import { FormControl, FormControlLabel, IconButton, InputAdornment, Radio, RadioGroup, TextField } from '@mui/material';
// interface Movie {
//     id: number;
//     title: string;
//     description: string;
//     releaseDate: string;
//     status: string;
//     genre: string;
//     level: string;
//     // seats: Seat[];
//     // sessions: Session[];
//     // orders: CustomerOrder[];
// }
// const BASE_URL = 'http://localhost:8080';

// interface Props {
//     onSearch: (query: string) => void;
// }
function MovieSearch() {
//     const [query, setQuery] = useState('');
//     //const [results, setResults] = useState([]);
//     const [category, setCategory] = useState('Released');
//     // const handleSearch = async () => {
//     //     onSearch(query, category);
//     // };
//     const handleSearch = async () => {
//         // onSearch(query, category);
//         axios.get(`${BASE_URL}/movies/search?query=${query}`)
//             .then((response) => {
//                 if (response.status === 200) {
//                     console.log("Search movie by query successful");
//                     console.log(response.data);
//                 }
//             })
//             .catch((error) => {
//                 throw error; // Handle error appropriately in your components
//             });
//     }
    return (<></>
//         <div style={{ marginTop: '3rem' }}>
//             <TextField
//                 type="text"
//                 placeholder="搜尋電影..."
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 InputProps={{
//                     endAdornment: (
//                         <InputAdornment position="end">
//                             <IconButton onClick={handleSearch}>
//                                 <Search />
//                             </IconButton>
//                         </InputAdornment>
//                     ),
//                 }}
//             />
//             <div style={{ marginTop: '1rem' }}>
//                 {/* <FormControl component="fieldset">
//           <RadioGroup
//             row
//             aria-label="movie-category"
//             name="movie-category"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             <FormControlLabel value="Released" control={<Radio />} label="熱映中" />
//             <FormControlLabel value="Upcoming" control={<Radio />} label="即將上映" />
//           </RadioGroup>
//         </FormControl> */}
//             </div>
//         </div>
    );
}

export default MovieSearch;
