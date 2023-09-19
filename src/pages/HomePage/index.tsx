import MovieSearch from '@/components/MovieSearch'
import { fetchMovies } from '@/services/api'
import { Card, CardContent, CardMedia, Theme, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

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
const theme = createTheme()

function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Released');

  useEffect(() => {
    (async () => {
      try {
        const movieData = await fetchMovies();
        setMovies(movieData);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query); 
    const filtered: Movie[] = movies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovies(filtered);
  };
  // Conditionally choose movies to display based on the search query
  const moviesToDisplay = searchQuery.trim() === '' ? movies : filteredMovies;
  const filteredByCategory = selectedCategory === 'Released'
  ? moviesToDisplay.filter((movie) => movie.status === 'RELEASED')
  : moviesToDisplay.filter((movie) => movie.status === 'UPCOMING');

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <MovieSearch onSearch={handleSearch} />
        {/* Display filteredMovies instead of movies */}
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <Typography variant="h4" component="h1" gutterBottom>
            熱映中
          </Typography> */}
          <div>
            <button onClick={() => setSelectedCategory('Released')}>熱映中</button>
            <button onClick={() => setSelectedCategory('Upcoming')}>即將上映</button>
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
                    <Link to={`/Movie/detail?id=${movie.id}`}>
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

