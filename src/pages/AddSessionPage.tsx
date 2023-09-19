import { createMovieSession, fetchMovieSessions } from '@/services/api';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
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

export default function AddSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const movieId = new URLSearchParams(location.search).get('movie');
  const [sessions, setSessions] = useState<Session[]>([]);
  const { movie } = location.state as { movie: Movie };
  const [openAddSessionDialog, setOpenAddSessionDialog] = useState(false);
  const [formSession, setFormSession] = useState<Session>({
    id: 0,
    startTime: '',
    endTime: '',
    sessionDate: '',
    movieId: parseInt(movieId || ''), // Parse movieId as a number
  });
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
    (async () => {
      try {
        const responseData = await createMovieSession(formSession);
        // Handle success, close dialog, and possibly refresh the movie sessions
        setSessions([...sessions, responseData]);
        setOpenAddSessionDialog(false);
        console.log("Session added successfully:", responseData);
      } catch (error) {
        console.error('Error adding session:', error);
      }
    })();
  };
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
    const handleAddSeatForMovie = (movie:Movie,session:Session)=>{
    //setSelectedMovie(movie);
    //setOpenAddSeatDialog(true);
    // Reset the form data for session
    // setFormSeat({
    //   isAvailable: 1,
    //   seatNumber: '',
    //   movieId: movie.id, // Convert movie ID to a string if needed
    //   sessionId:sessionId,
    // });
    navigate(`/Admin/Seats?movie=${movieId}&session=${session.id}`,{ state: {movieObject: movie ,sessionObject:session} })
  }
  const textField = formSession.startTime && formSession.endTime && formSession.sessionDate;
  return (
    <div>
      {/* Render your form for adding sessions here */}
      <h2>{movie.title}</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            電影座位管理
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
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.sessionDate}</TableCell>
                  <TableCell>{session.startTime}</TableCell>
                  <TableCell>{session.endTime}</TableCell>
                  <TableCell>
                  <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleAddSeatForMovie(movie,session)}
                    >
                      Add Seats
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openAddSessionDialog} onClose={() => setOpenAddSessionDialog(false)}>
        <DialogTitle>請輸入要新增的電影場次:</DialogTitle>
        <DialogContent>
          <TextField
            label="播放日期"
            fullWidth
            required
            value={formSession.sessionDate}
            onChange={(e) => setFormSession({ ...formSession, sessionDate: e.target.value })}
          />
          <TextField
            label="開始時間"
            fullWidth
            required
            value={formSession.startTime}
            onChange={(e) => setFormSession({ ...formSession, startTime: e.target.value })}
          />
          <TextField
            label="結束時間"
            fullWidth
            required
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


