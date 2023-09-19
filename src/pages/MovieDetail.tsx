import DateSelect from "@/components/DateSelect";
import PaymentSelect from "@/components/PaymentSelect";
import QuantitySelect from "@/components/QuantitySelect";
import SeatSelect from "@/components/SeatSelect";
import TicketSelect from "@/components/TicketSelect";
import { fetchMovieById, fetchMovies } from "@/services/api";
import { Box, Card, CardContent, CardMedia, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import { log } from "console";
import { FormEvent, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";

// interface Seat {
//   id: number;
//   seatNumber: string;
//   isAvailable: number;
// }
// interface CustomerOrder {
//   id: number;
//   price: number;
//   orderDate: string;
//   quantity: number;
//   payment: string;
// }
// interface Session {
//   id: number;
//   startTime: string;
//   endTime: string;
//   sessionDate: string;
//   //orders: CustomerOrder[];
// }
interface Movie {
  id: number;
  title: string;
  description: string;
  releaseDate: String;
  status:string;
  genre:string;
  level:string;
  coverUrl: string;
  // seats: Seat[];
  // sessions: Session[];
  // orders: CustomerOrder[];
}

const api = 'http://localhost:8080';

export default function MovieDetail() {
  const location = useLocation();
  const movie_id = new URLSearchParams(location.search).get("id");
  const user_id = parseInt(sessionStorage.getItem('user_id') || '');
  // const { movie_id } = useParams();
  console.log("movie_id:", movie_id);
  console.log("user_id:", user_id);

  const [movie, setMovie] = useState<Movie>();
  useEffect(() => {
    if (movie_id) {
      const movieId = parseInt(movie_id);  // Convert 'id' from string to number
      (async () => {
        try {
          const movieData = await fetchMovieById(movieId);
          setMovie(movieData);
          console.log(movieData);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [movie_id]);

  return (
    <Container style={{ maxWidth: "1600px", marginTop: 50 }}>
      {movie ? (
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-start"
          flexDirection="row"
        >
          <Box flex="1" marginRight={4}> {/* Adjust the flex value to move the image closer to the left */}
            <img
              src={movie.coverUrl}
              alt={movie.title}
              style={{
                width: "100%",
                height: "auto",
                //transform: "scale(0.5)",
              }}
            />
          </Box>
          <Box flex="1.5" marginRight={4}>
            <Typography variant="h5" component="h1" >
              {movie.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              上映日期: {movie.releaseDate}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              類型: {movie.genre}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {movie.level}
            </Typography>
          </Box>
          <Box flex="2.5"> 
            <Typography variant="h5" component="h2">
              電影介紹
            </Typography>
            <Typography variant="body1" color="textPrimary">
              {movie.description}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          Loading...
        </Typography>
      )}
    </Container>
  );
}

