import { createMovieSession, fetchMovieSessions } from '@/services/api';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'; // Import useParams to access route parameters

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
const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
// const SEAT_NUMBERS = Array.from({ length: 12 }, (_, i) => `${9 + i}`); //9~20
const SEAT_NUMBERS = [9, 20] //9~20
const BASE_URL = 'http://localhost:8080';
const token = sessionStorage.getItem('token');
export default function AddSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const movieId = new URLSearchParams(location.search).get('movie');
  const [sessions, setSessions] = useState<Session[]>([]);
  const { movie } = location.state as { movie: Movie };
  const [openAddSessionDialog, setOpenAddSessionDialog] = useState(false);
  const [openEditSessionDialog, setOpenEditSessionDialog] = useState(false);
  const [openDeleteSessionDialog, setOpenDeleteSessionDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session>();
  const [isSessionEditable, setIsSessionEditable] = useState(true);
  const [editSession, setEditSession] = useState({
    startTime: '',
    endTime: '',
    sessionDate: '',
    movieId: parseInt(movieId || ''),
  });
  const [formSession, setFormSession] = useState<Session>({
    id: 0,
    startTime: '',
    endTime: '',
    sessionDate: '',
    movieId: parseInt(movieId || ''), // Parse movieId as a number
  });
  // console.log("movie:", movie);

  const today = new Date();
  today.setDate(today.getDate() + 1);
  const today_new = today.toISOString().split('T')[0];
  useEffect(() => {
    (async () => {
      try {
        const sessionData = await fetchMovieSessions(formSession.movieId);
        console.log("sessionData:", sessionData);
        setSessions(sessionData);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const handleAddSession = () => {
    axios.post(  //ADMIN
      `${BASE_URL}/sessions`,
      formSession,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then((response) => {
      if (response.status === 201) {
        // Create seats for the new session
        const newSession = response.data;
        console.log(newSession);
        const newSeats = SEAT_ROWS.flatMap(row =>
        ({
          row: row,
          seatNumber: [SEAT_NUMBERS[0], SEAT_NUMBERS[1]],
          isAvailable: 1,
          movieId: newSession.movieId,
          sessionId: newSession.id,
        }))

        console.log(newSeats);
        newSeats.forEach((seats) => {
          axios.post(
            `${BASE_URL}/seats`,
            seats,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          )
            .then((response) => {
              if (response.status === 201) {
      
              }
            })
            .catch((error) => {
              if (error.response.status === 400) {
                alert(error.response.data);
              }
            })
        })

        alert(`新增場次成功\n 電影: ${movie.title}\n日期: ${formSession.sessionDate}\n開始時間: ${formSession.startTime} 結束時間: ${formSession.endTime} `);
        setSessions([...sessions, response.data]);
        setOpenAddSessionDialog(false);
      }
    }).catch((error) => {
      if (error.response.status === 400) {
        alert(error.response.data);
      }
    });
  }
  const handleEditSession = () => {
    // Send a POST request to add the new movie
    if (selectedSession) {
      axios.put(  //ADMIN
        `${BASE_URL}/sessions/${selectedSession.id}`,
        editSession,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      ).then((response) => {
        setSessions((prevSessions) =>
          prevSessions.map((session) =>
            session.id === selectedSession.id ? { ...session, ...editSession } : session
          )
        );
        setOpenEditSessionDialog(false);
      }).catch((error) => {
        if (error.response.status === 404) {
          alert(error.response.data);
        }
      });
    }
  }
  const handleDeleteSession = () => {
    // Send a POST request to add the new movie
    if (selectedSession) {
      axios.delete(  //ADMIN
        `${BASE_URL}/sessions/${selectedSession.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      ).then((response) => {
        alert('刪除電影成功');
        setSessions((prevSessions) =>
          prevSessions.filter((session) => session.id !== selectedSession.id)
        );
        setOpenDeleteSessionDialog(false);
      }).catch((error) => {
        if (error.response.status === 404) {
          alert(error.response.data);
        }
      });
    }
  }
  const handleAddSessionForMovie = () => {
    setOpenAddSessionDialog(true);
    // Reset the form data for session
    setFormSession({
      id: 0,
      startTime: '',
      endTime: '',
      sessionDate: '',
      movieId: movie.id,
    });
  };
  const handleEditSessionForMovie = (session: Session) => {
    setOpenEditSessionDialog(true);
    setSelectedSession(session);
    setEditSession(session);
    // checkSessionEditable(session);
  };
  const handleDeleteSessionForMovie = (session: Session) => {
    setOpenDeleteSessionDialog(true);
    setSelectedSession(session);
  };
  const handleAddSeatForMovie = (movie: Movie, session: Session) => {
    navigate(`/Admin/Seats?movie=${movieId}&session=${session.id}`, { state: { movieObject: movie, sessionObject: session } })
  }
  const sessionEditable = (sessionDate:string) => {
    const sessionDateParts = sessionDate.split('-');
    const sessionDateTime = new Date(
      parseInt(sessionDateParts[0]),
      parseInt(sessionDateParts[1]) - 1,
      parseInt(sessionDateParts[2]) + 1
    );
    const sessionDateTimes = sessionDateTime.toISOString().split('T')[0];
    
    console.log("sessionDateTimes", sessionDateTimes);
    console.log("today_new", today_new);
    if (sessionDateTimes <= today_new) {
      console.log("false");
      return false;
    } else {
      return true;
    }
  }
  const textField = formSession.startTime && formSession.endTime && formSession.sessionDate;
  const sessionEditField = editSession.startTime && editSession.endTime && editSession.sessionDate;
  //const sessionDeleteField = selectedSession.startTime && selectedSession.endTime && selectedSession.sessionDate;
  return (
    <div>
      {/* Render your form for adding sessions here */}
      <Typography marginTop={4} variant="h5">{movie.title}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            電影場次管理
          </TableHead>
          <TableBody>
            <TableRow key={movie.id}>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleAddSessionForMovie()}
                >
                  新增電影場次
                </Button>
              </TableCell>
              <TableRow>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
                <TableCell>播放日期</TableCell>
                <TableCell>開始時間</TableCell>
                <TableCell>結束時間</TableCell>
              </TableRow>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteSessionForMovie(session)}
                    >
                      刪除場次
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleEditSessionForMovie(session)}
                      disabled={!sessionEditable(session.sessionDate)}
                    >
                      修改時間
                    </Button>
                  </TableCell>
                  {/* <TableCell>場次</TableCell> */}
                  <TableCell>{session.sessionDate}</TableCell>
                  <TableCell>{session.startTime}</TableCell>
                  <TableCell>{session.endTime}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      //size="small"
                      color="secondary"
                      onClick={() => handleAddSeatForMovie(movie, session)}
                      //disabled={!sessionEditable(session.sessionDate)}
                    >
                      修改座位
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openEditSessionDialog} onClose={() => setOpenEditSessionDialog(false)}>
        <DialogTitle>修改電影時間:</DialogTitle>
        <DialogContent>
          {!isSessionEditable ? "場次已過期，無法修改時間。" :
            <div>
              <Typography variant="body2" style={{ fontSize: '15px', marginLeft: '10px', color: 'gray' }}>播放日期</Typography>
              <TextField
                //label="播放日期"
                fullWidth
                required
                type="date"
                value={editSession.sessionDate}
                onChange={(e) => setEditSession({ ...editSession, sessionDate: e.target.value })}
              />
              <Typography variant="body2" style={{ fontSize: '15px', marginLeft: '10px', color: 'gray' }}>開始時間</Typography>
              <TextField
                //label="開始時間"
                fullWidth
                required
                type="time"
                value={editSession.startTime}
                onChange={(e) => setEditSession({ ...editSession, startTime: e.target.value })}
              />
              <Typography variant="body2" style={{ fontSize: '15px', marginLeft: '10px', color: 'gray' }}>結束時間</Typography>
              <TextField
                //label="結束時間"
                fullWidth
                required
                type="time"
                value={editSession?.endTime}
                onChange={(e) => setEditSession({ ...editSession, endTime: e.target.value })}
              />
            </div>
          }
        </DialogContent>
        <DialogActions>
         
          {!isSessionEditable ?
            <Button onClick={() => setOpenEditSessionDialog(false)}>
             OK
            </Button> :
            <div>
             <Button onClick={() => setOpenEditSessionDialog(false)}>
             Cancel
           </Button>
            <Button onClick={handleEditSession} color="primary" disabled={!sessionEditField}>
              CONFIRM
            </Button>
            </div>
          }
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteSessionDialog} onClose={() => setOpenDeleteSessionDialog(false)}>
        <DialogTitle>請確認要刪除的場次</DialogTitle>
        <DialogContent>
          <Typography variant="body2" style={{ fontSize: '20px', marginLeft: '10px', marginBottom: '3px', color: 'gray' }}>{movie.title}</Typography>
          <Typography variant="body2" style={{ fontSize: '18px', marginLeft: '10px', color: 'gray' }}>播放日期:{selectedSession?.sessionDate}</Typography>
          <Typography variant="body2" style={{ fontSize: '18px', marginLeft: '10px', color: 'gray' }}>開始時間:{selectedSession?.startTime}</Typography>
          <Typography variant="body2" style={{ fontSize: '18px', marginLeft: '10px', color: 'gray' }}>結束時間:{selectedSession?.endTime}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteSessionDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteSession} color="primary" >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAddSessionDialog} onClose={() => setOpenAddSessionDialog(false)}>
        <DialogTitle>請輸入要新增的電影場次:</DialogTitle>
        <DialogContent>
          <Typography variant="body2" style={{ fontSize: '15px', marginLeft: '10px', color: 'gray' }}>播放日期</Typography>
          <TextField
            //label="播放日期"
            fullWidth
            required
            type="date"
            InputProps={{
              inputProps: {
                min: today_new, // Set the minimum date to today
                max: '9999-12-31', // Maximum date allowed 
              },
            }}
            value={formSession.sessionDate}
            onChange={(e) => setFormSession({ ...formSession, sessionDate: e.target.value })}
          />
          <Typography variant="body2" style={{ fontSize: '15px', marginLeft: '10px', color: 'gray' }}>開始時間</Typography>
          <TextField
            //label="開始時間"
            fullWidth
            required
            type="time"
            value={formSession.startTime}
            onChange={(e) => setFormSession({ ...formSession, startTime: e.target.value })}
          />
          <Typography variant="body2" style={{ fontSize: '15px', marginLeft: '10px', color: 'gray' }}>結束時間</Typography>
          <TextField
            //label="結束時間"
            fullWidth
            required
            type="time"
            value={formSession.endTime}
            onChange={(e) => setFormSession({ ...formSession, endTime: e.target.value })}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddSessionDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddSession} color="primary" disabled={!textField}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


