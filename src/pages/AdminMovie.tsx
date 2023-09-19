import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import { createMovie, createMovieSession, createOrder, fetchMovies } from '@/services/api';
import { Link, Route, Router, Routes, useNavigate } from 'react-router-dom';
import AddSessionPage from './AddSessionPage';
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
  startTime: Date;
  endTime: Date;
  sessionDate: Date;
  movieId: number;
}
export default function AdminMovie() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openAddSessionDialog, setOpenAddSessionDialog] = useState(false);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseDate: '',
    status: '',
    genre: '',
    level: '',
    coverUrl: '',
  });
  // const [formSession, setFormSession] = useState({
  //   startTime: '',
  //   endTime: '',
  //   sessionDate: '',
  //   movieId: 0
  // });
  useEffect(() => {
    (async () => {
      try {
        const movieData = await fetchMovies();
        console.log("movieData:", movieData);
        setMovies(movieData);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const handleAddMovie = () => {
    // Send a POST request to add the new movie
    (async () => {
      try {
        const responseData = await createMovie(formData);
        setMovies([...movies, responseData]);
        setOpenAddDialog(false);
        console.log("responseData:", responseData);
        console.log("Add movie successful!");
        alert('新增電影成功');
        //navigate('/');
      } catch (error) {
        console.log(error);
      }
    })();
  };
  const handleAddSession = () => {
    
    // const sessionData = {
    //   startTime: formSession.startTime,
    //   endTime: formSession.endTime,
    //   sessionDate: formSession.sessionDate,
    //   movieId: selectedMovie?.id, // Use the selected movie's ID
    // };
    // (async () => {
    //   try {
    //     const responseData = await createMovieSession(sessionData);
    //     // Handle success, close dialog, and possibly refresh the movie sessions
    //     setOpenAddSessionDialog(false);
    //     console.log("Session added successfully:", responseData);
    //     //alert('Movie session added successfully');
    //   } catch (error) {
    //     console.error('Error adding session:', error);
    //   }
    // })();
  };

  // const handleEditMovie = () => {
  //   // Send a PUT request to update the selected movie
  //   axios.put(`/api/movies/${selectedMovie.id}`, formData)
  //     .then(() => {
  //       // Update the movie list
  //       const updatedMovies = movies.map((movie) =>
  //         movie.id === selectedMovie.id ? { ...movie, ...formData } : movie
  //       );
  //       setMovies(updatedMovies);
  //       setOpenEditDialog(false);
  //     })
  //     .catch((error) => {
  //       console.error('Error editing movie:', error);
  //     });
  // };

  // const handleDeleteMovie = () => {
  //   // Send a DELETE request to delete the selected movie
  //   axios.delete(`/api/movies/${selectedMovie.id}`)
  //     .then(() => {
  //       // Update the movie list
  //       const updatedMovies = movies.filter((movie) =>
  //         movie.id !== selectedMovie.id
  //       );
  //       setMovies(updatedMovies);
  //       setOpenEditDialog(false); // Close the confirmation dialog
  //     })
  //     .catch((error) => {
  //       console.error('Error deleting movie:', error);
  //     });
  //};
  const handleAddSessionForMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    //setOpenAddSessionDialog(true);
    // Reset the form data for session
    // setFormSession({
    //   startTime: '',
    //   endTime: '',
    //   sessionDate: '',
    //   movieId: movie.id, // Convert movie ID to a string if needed
    // });
    navigate(`/Admin/Sessions?movie=${movie.id}`,{ state: {movie: movie} });
  };

  return (
    <div>
      <h2>Movie Management</h2>
      <Button variant="outlined" color="primary" onClick={() => setOpenAddDialog(true)}>
        Add Movie
      </Button>
      {/* <Button variant="outlined" color="primary" onClick={() => setOpenAddSessionDialog(true)}>
        Add Movie Session
      </Button> */}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {/* Table header */}
          </TableHead>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell>{movie.title}</TableCell>
                <TableCell>{movie.description}</TableCell>
                <TableCell>
                  {/* <Link to={`/Admin/Sessions?movie=${movie.id}`} style={{ textDecoration: 'none' }}> */}
                    {/* <Button variant="outlined" color="primary" onClick={handleAddSession}>
                      Add Session
                    </Button> */}
                  {/* </Link> */}
                  <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleAddSessionForMovie(movie)}
                    >
                      Add Session
                    </Button>
                    {/* <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleAddSeatForMovie(movie)}
                    >
                      Add Seat
                    </Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Movie Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add Movie</DialogTitle>
        <DialogContent>
          {/* Add Movie Form */}
          <TextField
            label="Title"
            fullWidth
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            label="ReleaseDate"
            fullWidth
            required
            value={formData.releaseDate}
            onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
          />
          <TextField
            label="Status"
            fullWidth
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          />
          <TextField
            label="Genre"
            fullWidth
            required
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          />
          <TextField
            label="Level"
            fullWidth
            required
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          />
          <TextField
            label="CoverUrl"
            fullWidth
            required
            value={formData.coverUrl}
            onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
          />
          {/* Add more form fields here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddMovie} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/* <Dialog open={openAddSessionDialog} onClose={() => setOpenAddSessionDialog(false)}>
        <DialogTitle>Add Movie Session</DialogTitle>
        <DialogContent> */}
          {/* Add Session Form */}
          {/* Form fields for startTime, endTime, sessionDate */}
          {/* <TextField
            label="StartTime"
            fullWidth
            required
            value={formSession.startTime}
            onChange={(e) => setFormSession({ ...formSession, startTime: e.target.value })}
          />
          <TextField
            label="EndTime"
            fullWidth
            required
            value={formSession.endTime}
            onChange={(e) => setFormSession({ ...formSession, endTime: e.target.value })}
          />
          <TextField
            label="SessionDate"
            fullWidth
            required
            value={formSession.sessionDate}
            onChange={(e) => setFormSession({ ...formSession, sessionDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddSessionDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSession} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog> */}
      {/* Edit/Delete Movie Dialog */}
      {/* <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}> */}
      {/* Edit/Delete content here */}
      {/* </Dialog> */}

    </div>
  );
}

// export default AdminMovieManagement;
