import { createMovieSeats, createMovieSession, fetchMovieSeats, fetchMovieSessions } from '@/services/api';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom'; // Import useParams to access route parameters

interface Movie {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  status: string;
  genre: string;
  level: string;
  coverUrl: string;
}
interface Session {
  id: number;
  startTime: string;
  endTime: string;
  sessionDate: string;
  movieId: number;
}
interface Seat {
  id: number;
  seatNumber: string;
  isAvailable: number;
  movieId: number;
}
interface SeatCreate {
  row:string;
  seatNumber: string[];
  isAvailable: number;
  movieId: number;
  sessionId:number;
}
export default function AddSeatPage() {
  const location = useLocation();
  const movieId = parseInt(new URLSearchParams(location.search).get('movie')||'');
  const sessionId = parseInt(new URLSearchParams(location.search).get('session')||'');
  const [seats, setSeats] = useState<Seat[]>([]);
  const { movieObject, sessionObject } = location.state as { movieObject: Movie, sessionObject: Session };
  console.log("movie:",movieObject);
  console.log("session:",sessionObject);

  const [openAddSeatDialog, setOpenAddSeatDialog] = useState(false);
  const [formSeat, setFormSeat] = useState<SeatCreate>({
    row:'',
    seatNumber: ['0','0'],
    isAvailable: 1,
    movieId: movieId,
    sessionId: sessionId,
 });
  useEffect(() => {
    (async () => {
      try {
        const seatsData = await fetchMovieSeats(movieId,sessionId);
        console.log("seatData:", seatsData);
        setSeats(seatsData);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const handleAddSeat = () => {
    (async () => {
      try {
        const responseData = await createMovieSeats(formSeat);
        // Handle success, close dialog, and possibly refresh the movie sessions
        setSeats([...seats, responseData]);
        setOpenAddSeatDialog(false);
        console.log("Seat added successfully:", responseData);
      } catch (error) {
        console.error('Error adding session:', error);
      }
    })();
  };
  const handleAddSeatForMovie = () => {
    setOpenAddSeatDialog(true);
    // Reset the form data for session
    setFormSeat({
      row:'',
      seatNumber: ['0','0'],
      isAvailable: 1,
      movieId: movieId,
      sessionId:sessionId,
    });
  };
  const textField = formSeat.seatNumber;
  return (
    <div>
      {/* Render your form for adding sessions here */}
      <h2>{movieObject.title}</h2>
      <h5>播放日期 {sessionObject.sessionDate} </h5>
      <h5>{sessionObject.startTime} 到 {sessionObject.endTime}</h5>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            座位管理
          </TableHead>
          <TableBody>
            <TableRow key={sessionObject.id}>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleAddSeatForMovie()}
                >
                  新增電影座位
                </Button>
              </TableCell>
              {seats.map((seat) => (
                <TableRow key={seat.id}>
                  <TableCell>{seat.seatNumber}</TableCell>
                  <TableCell>{seat.isAvailable}</TableCell>
                </TableRow>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openAddSeatDialog} onClose={() => setOpenAddSeatDialog(false)}>
        <DialogTitle>請輸入要新增的電影座位:</DialogTitle>
        <DialogContent>
        <TextField
            label="排數"
            fullWidth
            required
            value={formSeat.row}
            onChange={(e) => setFormSeat({ ...formSeat,row: e.target.value})}
          />
          <TextField
            label="FROM座位號碼"
            fullWidth
            required
            value={formSeat.seatNumber[0]}
            onChange={(e) => setFormSeat({ ...formSeat,seatNumber: [e.target.value, formSeat.seatNumber[1]]})}
          />
          <TextField
            label="TO座位號碼"
            fullWidth
            required
            value={formSeat.seatNumber[1]}
            onChange={(e) => setFormSeat({ ...formSeat,seatNumber: [formSeat.seatNumber[0], e.target.value] })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddSeatDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddSeat} color="primary" disabled={!textField}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


