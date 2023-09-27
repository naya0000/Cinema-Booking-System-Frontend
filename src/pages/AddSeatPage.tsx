import { createMovieSession, fetchMovieSeats, fetchMovieSessions } from '@/services/api';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom'; // Import useParams to access route parameters
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import '@assets/style.css';
import axios from 'axios';
import { isDisabled } from '@testing-library/user-event/dist/utils';
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
  seatRow: string;
  seatNumber: string;
  isAvailable: number;
  movieId: number;
}
interface SeatData {
  row: string;
  seatNumber: string[];
  isAvailable: number;
  movieId: number;
  sessionId: number;
}
interface SeatGrouped {
  seatRow: string;
  seats: Seat[];
}

const api = 'http://localhost:8080';
const token = sessionStorage.getItem('token');
export default function AddSeatPage() {
  const location = useLocation();
  const movieId = parseInt(new URLSearchParams(location.search).get('movie') || '');
  const sessionId = parseInt(new URLSearchParams(location.search).get('session') || '');
  const [seats, setSeats] = useState<Seat[]>([]);
  const { movieObject, sessionObject } = location.state as { movieObject: Movie, sessionObject: Session };
  const [isSessionEditable, setIsSessionEditable] = useState(true);
  console.log("movie:", movieObject);
  console.log("session:", sessionObject);

  const [openAddSeatDialog, setOpenAddSeatDialog] = useState(false);
  const [formSeat, setFormSeat] = useState<SeatData>({
    row: '',
    seatNumber: ['', ''],
    isAvailable: 1,
    movieId: movieId,
    sessionId: sessionId,
  });
  useEffect(() => {
    // Check if the session date and start time are before the current time
    const currentDateTime = new Date();
    const sessionDateTime = new Date(`${sessionObject.sessionDate} ${sessionObject.startTime}`);
    setIsSessionEditable(sessionDateTime > currentDateTime);
  }, [sessionObject]);
  useEffect(() => {
    (async () => {
      try {
        const seatsData = await fetchMovieSeats(movieId, sessionId);
        setSeats(seatsData);
        console.log("seatData:", seatsData);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  // Group seats by seatRow
  const groupedSeats: SeatGrouped[] = [];
  // const sortedSeats = 
  seats.sort((a, b) => {
    // 先按 seatRow 排序，然后按 seatNumber 排序
    if (!a.seatRow)
      console.log("a.seatRow:", a);
    if (!b.seatRow)
      console.log("b.seatRow:", b);
    const seatRowA = a.seatRow || ''; // 将可能的 undefined 转换为空字符串
    const seatRowB = b.seatRow || ''; // 将可能的 undefined 转换为空字符串
    if (seatRowA === seatRowB) {
      return parseInt(a.seatNumber) - parseInt(b.seatNumber);
    }
    return seatRowA.localeCompare(seatRowB);
  });
  seats.forEach((seat) => {
    const group = groupedSeats.find((group) => group.seatRow === seat.seatRow);
    if (group) {
      group.seats.push(seat);
    } else {
      groupedSeats.push({ seatRow: seat.seatRow, seats: [seat] });
    }
  });

  const handleAddSeat = () => { //ADMIN
    //const token1 = eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6InNlbGluYUBnbWFpbC5jb20iLCJleHAiOjE2OTYxMTg1OTUsImlzcyI6Ik1vdmllIFRoZWF0ZXIiLCJyb2xlcyI6WyJST0xFX0FETUlOIiwiUk9MRV9VU0VSIl19.huzme4XIZ_GFwLDi1e2-Dp6cKtooCd7mfbgrfclSj3fbvaJC-K9n49yT4eX69PemfwyUOc6rKcVYYiF7KhihnQ;
    axios.post(
      `${api}/seats`,
      formSeat,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
      .then((response) => {
        if (response.status === 201) {
          setSeats((prevSeats) => [...prevSeats, ...response.data]);
          alert("座位新增成功");
          //console.log("create seats successful");
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          alert(error.response.data);
        }
      })
    setOpenAddSeatDialog(false);
  };
  useEffect(() => {
    console.log("seats change:", seats);
  }, [seats]);

  const handleAddSeatForMovie = () => {
    setOpenAddSeatDialog(true);
    // Reset the form data for session
    setFormSeat({
      row: '',
      seatNumber: ['', ''],
      isAvailable: 1,
      movieId: movieId,
      sessionId: sessionId,
    });
  };
  // change the seat status
  const toggleLock = (id: number, isAvailable: number) => {
    console.log(id);
    axios.put(`${api}/seats`, { //ADMIN
      id: id,
      isAvailable: isAvailable,
    },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        //console.log(response);
        if (response.status === 200) {
          alert(response.data);
          setSeats((prevSeats) =>
            prevSeats.map((prevSeat) =>
              prevSeat.id === id ? { ...prevSeat, isAvailable: isAvailable } : prevSeat
            )
          );
        }
      })
      .catch(
        (error) => {
          alert(error.response.data);
        }
      )
  }
  const deleteSeat = (id: number) => {
    axios.delete(`${api}/seats/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }) //ADMIN
      .then((response) => {
        //console.log(response);
        if (response.status) {
          alert(response.data);
          setSeats((prevSeats) =>
            prevSeats.filter((prevSeat) =>
              prevSeat.id !== id
            )
          );
        }
      })
      .catch(
        (error) => {
          alert(error.response.data);
        }
      )
  }
  // Calculate the maximum number of seats in a row
  const maxSeatsInRow = Math.max(...groupedSeats.map(group => group.seats.length), 0);

  const textField = formSeat.seatNumber;
  return (
    <div >
      {/* Render your form for adding sessions here */}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography marginTop={4} variant="h5">{movieObject.title} 場次:</Typography>
          {/* <Typography variant="h6">場次:</Typography> */}
          <Typography variant="h6">{sessionObject.sessionDate}, {sessionObject.startTime} ~ {sessionObject.endTime}</Typography>
        </div>
       
        
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px'  }}>
          <CheckCircleIcon color="primary" style={{ marginRight: '8px' }} />{'未售出'}
          <CancelIcon color="error" style={{ margin: '0 8px' }} />{'已售出'}
          <DeleteOutlineIcon style={{ marginLeft: '8px' }} />{'刪除座位'} 
        </div>
        <div style={{display: 'flex', alignItems: 'center',marginTop: '16px', color:"red"}}>
          {isSessionEditable?' ':'場次已過期，無法修改座位。'}
        </div>
     
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleAddSeatForMovie()}
          disabled={!isSessionEditable}
        >
          新增電影座位
        </Button>

      </div>
      {/* <h5>{sessionObject.sessionDate} {sessionObject.startTime} ~ {sessionObject.endTime}</h5> */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
          </TableHead>
          <TableBody>

            <TableRow>

              {groupedSeats.map((group) => (
                <TableRow key={group.seatRow}>
                  <TableCell>
                    <Typography variant="subtitle1">{group.seatRow}</Typography>
                  </TableCell>
                  {group.seats.map((seat) => (
                    <TableCell key={seat.id}>
                      <div className="horizontal-seat">
                        <div className="seat-number">{seat.seatNumber}</div>
                      </div>
                      <div className="is-available">
                        {seat.isAvailable ? (
                          <IconButton
                            onClick={() => toggleLock(seat.id, 0)}
                            color="primary"
                            disabled={ !isSessionEditable}
                          >
                            <CheckCircleIcon color="primary" />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => toggleLock(seat.id, 1)}
                            color="primary"
                            disabled={ !isSessionEditable}
                          >
                            <CancelIcon color="error" />
                          </IconButton>
                        )}
                      </div>
                      <IconButton
                        onClick={() => deleteSeat(seat.id)}
                        disabled={!seat.isAvailable||!isSessionEditable}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </TableCell>
                  ))}
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
            onChange={(e) => setFormSeat({ ...formSeat, row: e.target.value })}
          />
          <TextField
            label="FROM座位號碼"
            fullWidth
            required
            value={formSeat.seatNumber[0]}
            onChange={(e) => setFormSeat({ ...formSeat, seatNumber: [e.target.value, formSeat.seatNumber[1]] })}
          />
          <TextField
            label="TO座位號碼"
            fullWidth
            required
            value={formSeat.seatNumber[1]}
            onChange={(e) => setFormSeat({ ...formSeat, seatNumber: [formSeat.seatNumber[0], e.target.value] })}
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


