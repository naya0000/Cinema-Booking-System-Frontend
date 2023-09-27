// import MovieSearch from '@/components/MovieSearch'
import { fetchMovies } from '@/services/api'
import { Button, ButtonGroup, Card, CardContent, CardMedia, IconButton, InputAdornment, TextField, Theme, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import {
  createTheme, ThemeProvider, alpha,
  getContrastRatio
} from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { lime, purple } from '@mui/material/colors';
import axios from 'axios'
import { Search } from '@mui/icons-material'
interface Movie {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  status: string;
  genre: string;
  level: string;
  coverUrl: string;
  // seats: Seat[];
  // sessions: Session[];
  // orders: CustomerOrder[];
}

declare module '@mui/material/styles' {
  interface Palette {
    violet: Palette['primary'];
  }

  interface PaletteOptions {
    violet?: PaletteOptions['primary'];
  }
}

// Update the Button's color options to include a violet option
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    violet: true;
  }
}

const violetBase = '#7F00FF';
const violetMain = alpha(violetBase, 0.7);
const BASE_URL = 'http://localhost:8080';
const theme = createTheme({
  palette: {
    // violet: {
    //   main: violetMain,
    //   light: alpha(violetBase, 0.5),
    //   dark: alpha(violetBase, 0.9),
    //   contrastText: getContrastRatio(violetMain, '#fff') > 4.5 ? '#fff' : '#111',
    // },
  },
});
function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [cateMovies, setCateMovies] = useState<Movie[]>([]);
  const [displayMovies, setDisplayMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Released');
  // const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('roles') || '';
  const roles = role.toString();
  console.log(roles);
  useEffect(() => {
    (async () => {
      try {
        const movieData = await fetchMovies();
        setMovies(movieData);
        //setFilteredMovies(movieData);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const handleSearch = async (query: string, category: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/movies/search?query=${query}`);
      if (response.status === 200) {
        console.log("Search movie by query successful");
        console.log(response.data);
        // Get the IDs of the movies from the response
        const movieIds = response.data;

        // Filter the movies based on the IDs
        const filtered = movies.filter((movie) => movieIds.includes(movie.id));
        const fil = filtered.filter((movie) => movie.status === category.toUpperCase())
        console.log("filtered:", fil);
        // Set filteredMovies based on the filtered list
        setFilteredMovies(fil);


      }
    } catch (error) {
      console.error("Error searching movies:", error);
      // Handle error appropriately in your components
    }
  };

  // const handleSearch = (query: string) => {
  //   setSearchQuery(query);
  //   const filtered: Movie[] = movies.filter((movie) =>
  //     movie.title.toLowerCase().includes(query.toLowerCase())
  //   );
  //   setFilteredMovies(filtered);
  // };
  // Conditionally choose movies to display based on the search query
  console.log(filteredMovies);


  const moviesToDisplay = filteredMovies.length === 0 ? movies : filteredMovies;
  const filteredByCategory = selectedCategory === 'Released'
    ? moviesToDisplay.filter((movie) => movie.status === 'RELEASED')
    : moviesToDisplay.filter((movie) => movie.status === 'UPCOMING');


  return (

    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        {roles === "ROLE_ADMIN" && (
          <div>
            <Typography variant="h5" component="div" sx={{ m: 8 }}>
              後台管理頁面
            </Typography>
            <Button component={Link} to="/Admin/Orders" variant="outlined" sx={{ m: 8 }}>
              訂單管理
            </Button>
            <Button component={Link} to="/Admin/Movies" variant="outlined" sx={{ m: 8 }}>
              電影管理
            </Button>
            <Button component={Link} to="/Admin/Users" variant="outlined" sx={{ m: 8 }}>
              用戶管理
            </Button>
          </div>
        )}
        {roles !== "ROLE_ADMIN" && (<div>
          {selectedCategory === 'Released' ?
            <TextField
              sx={{ marginTop: '35px' }}
              type="text"
              placeholder="搜尋熱映中的電影..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleSearch(searchQuery, 'RELEASED')}>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            /> :
            <TextField
              sx={{ marginTop: '35px' }}
              type="text"
              placeholder="搜尋即將上映的電影..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleSearch(searchQuery, 'UPCOMING')}>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          }
          {/* <MovieSearch onSearch={handleSearch} /> */}
          {/* Display filteredMovies instead of movies */}
          <Box
            sx={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >

            {/* <div>
            <button onClick={() => setSelectedCategory('Released')}>熱映中</button>
            <button onClick={() => setSelectedCategory('Upcoming')}>即將上映</button>
          </div> */}
            <div>
              <ButtonGroup sx={{ mb: 2 }}>
                <Button
                  variant={selectedCategory === 'Released' ? 'contained' : 'outlined'}
                  // color="violet"
                  onClick={() => setSelectedCategory('Released')}
                // sx={{backgroundColor:'black'}}
                >
                  熱映中
                </Button>
                <Button
                  variant={selectedCategory === 'Upcoming' ? 'contained' : 'outlined'}
                  //color="violet"
                  onClick={() => setSelectedCategory('Upcoming')}
                // sx={{backgroundColor:'black'}}
                >
                  即將上映
                </Button>
              </ButtonGroup>
            </div>

            <Grid container spacing={2}>
              {filteredByCategory
                .map((movie) => (
                  <Grid item key={movie.id} xs={8} sm={4} md={3}>
                    <Card sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch', // Stretch cards to equal height
                      height: '100%', // Ensure the cards fill the grid item height
                    }}>
                      <Link to={`/Movie/Detail?id=${movie.id}`}>
                        <CardMedia
                          component="img"
                          image={movie.coverUrl}
                          alt={movie.title}
                          sx={{
                            objectFit: 'cover', // Maintain aspect ratio and cover the card
                            height: '400px',
                          }}
                        />
                      </Link>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {movie.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {movie.releaseDate}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {movie.level}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
        </div>
        )}
      </Container>
    </ThemeProvider>
  )
}

export default HomePage
function styles(arg0: (theme: any) => {
  cardContainer: {
    display: string; flexDirection: string; alignItems: string // Stretch cards to equal height
    height: string
  }; cardMedia: {
    flex: number // Allow the image to expand within the card
    objectFit: string
  }
}) {
  throw new Error('Function not implemented.')
}

