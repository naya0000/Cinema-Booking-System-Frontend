import DateSelect from "@/components/DateSelect";
import PaymentSelect from "@/components/PaymentSelect";
import QuantitySelect from "@/components/QuantitySelect";
import SeatSelect from "@/components/SeatSelect";
import TicketSelect from "@/components/TicketSelect";
import { fetchMovieById, fetchMovieSeats, fetchMovies } from "@/services/api";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import { log } from "console";
import { FormEvent, useEffect, useState } from "react";
import { Navigate, useNavigate, useOutletContext, useParams } from "react-router-dom";

interface Seat {
  id: number;
  seatRow: string;
  seatNumber: string;
  isAvailable: number;
}
interface CustomerOrder {
  id: number;
  price: number;
  orderDate: string;
  quantity: number;
  payment: string;
}
interface Session {
  id: number;
  startTime: string;
  endTime: string;
  sessionDate: string;
  //orders: CustomerOrder[];
}
interface Movie {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  status: string;
  genre: string;
  level: string;
  coverUrl: string;
  seats: Seat[];
  sessions: Session[];
  orders: CustomerOrder[];
}

const api = 'http://localhost:8080';

export default function BookingDetail() {
  const navigate = useNavigate();
  const user_id = parseInt(sessionStorage.getItem('user_id') || '');
  const { movie_id } = useParams();
  const [isFormValid, setIsFormValid] = useState(false);
  const [seats, setSeats] = useState<Seat[]>([]);
  // Define your form fields here
  const [formData, setFormData] = useState({ //orderData
    // price: 0,
    quantity: '',
    payment: '',
    orderDate: '',
    sessionId: 0,
    movieId: movie_id,
    userId: user_id,
    selectedSeats: [] as number[] | string, // Example: Add a field for selected seats
    ticket: '',
  });

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
  useEffect(() => {
    if (movie_id) {
      const movieId = parseInt(movie_id);
      (async () => {
        try {
          const seatsData = await fetchMovieSeats(movieId, formData.sessionId);
          setSeats(seatsData);
          console.log("movieId:",movieId,"formData.sessionId:",formData.sessionId," seatData:", seatsData);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [formData.sessionId]);
  useEffect(() => {
    // Calculate form validity based on the condition
    const isValid = formData.selectedSeats.length === parseInt(formData.quantity);
    setIsFormValid(isValid);
  }, [formData]);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!isFormValid) {
      return; // Don't submit if the form is not valid
    }
    const now = new Date();
    // Handle form submission here, e.g., send data to the server
    console.log("formData.selectedSeats:", formData.selectedSeats);
    const OrderData = { //orderData
      orderDate: now.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }),
      quantity: formData.quantity,
      payment: formData.payment,
      movie: {
        id: formData.movieId
      },
      session: {
        id: formData.sessionId,
      },
      user: {
        id: formData.userId,
      },
      seatsId: formData.selectedSeats,
      ticket: formData.ticket,
      totalAmount: (formData.ticket === "Regular_Ticket" ? 100 : 90) * parseInt(formData.quantity) + 20*parseInt(formData.quantity),
    };
    console.log("totalAmount:", OrderData.totalAmount);
    // Redirect to OrderDetail with orderData as route parameters
    navigate(`/Booking/confirm`, { state: { orderData: OrderData } });
  }

  return (
    <Container style={{ maxWidth: "1600px", marginTop: 50 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={2}>
          {movie && (
            <Box>
              <img
                src={movie.coverUrl}
                alt={movie.title}
                style={{
                  width: "200px",
                  height: "auto",
                }}
              />
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={4} marginLeft={3}>
          {movie && (
            <Box>
              <Typography variant="h5" component="h1">
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
              <Typography variant="body2" color="textSecondary" marginTop={1}>
                電影介紹:
              </Typography>
              <Typography variant="body2" color="textSecondary" >
                {movie.description}
              </Typography>

            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={5}>
          <form onSubmit={handleSubmit}>
            <DateSelect
              onChange={(sessionId) => setFormData({ ...formData, sessionId })}
              timeList={movie?.sessions || []}
            />
            <QuantitySelect
              value={formData.quantity}
              onChange={(quantity) => setFormData({ ...formData, quantity })}
            />
            <SeatSelect
              movieSeats={seats || []}
              quantity={parseInt(formData.quantity)}
              onChange={(selectedSeats) => setFormData({ ...formData, selectedSeats })}
            />
            <TicketSelect
              onChange={(ticket) => setFormData({ ...formData, ticket })}
            />
            <Button variant="contained" type="submit" color="primary" style={{ marginTop: "16px" }}
              disabled={!isFormValid} // Disable the button if the form is not valid
            >
              Submit Order
            </Button>
          </form>
        </Grid>
      </Grid>
    </Container>

  );
}