import { createMovieSession, fetchMovieSeats, fetchMovieSessions } from '@/services/api';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom'; // Import useParams to access route parameters
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import '@assets/style.css';
import axios from 'axios';
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
const api = 'http://localhost:8080';
const token = sessionStorage.getItem('token'); 
export default function AddSeatPage() {
  const location = useLocation();
  const movieId = parseInt(new URLSearchParams(location.search).get('movie') || '');
  const sessionId = parseInt(new URLSearchParams(location.search).get('session') || '');
  const [seats, setSeats] = useState<Seat[]>([]);
  const { movieObject, sessionObject } = location.state as { movieObject: Movie, sessionObject: Session };
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
  const sortedSeats = seats.sort((a, b) => {
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
        if(error.response.status === 400){
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
  const deleteSeat = (id:number) =>{ 
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
            {/* <TableRow>
              <TableCell>座位号</TableCell>
              <TableCell>是否可用</TableCell>
            </TableRow> */}
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleAddSeatForMovie()}
                >
                  新增电影座位
                </Button>
              </TableCell>
              {seats.map((seat) => (
                <TableCell key={seat.id}>
                  <div className="horizontal-seat">
                    <div className="seat-row">{seat.seatRow}</div>
                    <div className="seat-number">{seat.seatNumber}</div>
                  </div>
                  <div className="is-available">
                    {seat.isAvailable ? (
                      <IconButton
                        onClick={() => toggleLock(seat.id, 0)}
                        color="primary"
                      >
                        <CheckCircleIcon color="primary" />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() => toggleLock(seat.id, 1)}
                        color="primary"
                      >
                        <CancelIcon color="error" />
                      </IconButton>
                    )}
                  </div>
                  <IconButton
                        onClick={() => deleteSeat(seat.id)}
                       // color="primary"
                      >
                  <DeleteOutlineIcon/>
                  </IconButton>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <CheckCircleIcon color="primary" />{'未售出'}
      <CancelIcon color="error" />{'已售出'}
      <DeleteOutlineIcon/>{'刪除座位'}
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


