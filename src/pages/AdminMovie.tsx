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
  Select,
  MenuItem,
  InputLabel,
  Box,
  FormControl,
  Typography,
  styled,
} from '@mui/material';

import axios from 'axios';
import { createMovie, updateMovie, createMovieSession, createOrder, fetchMovies, deleteMovie } from '@/services/api';
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

const Genre = ['喜劇片', '動作片', '恐怖片', '懸疑片', '紀錄片', '愛情片', '動漫片', '科幻片', '劇情片'];
const Level = ['普遍級', '保護級', '輔導級', '限制級'];
export default function AdminMovie() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
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
  const [editedMovieData, setEditedMovieData] = useState({
    title: '',
    description: '',
    releaseDate: '',
    status: '',
    genre: '',
    level: '',
    coverUrl: '',
  });

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
  const handleEditMovie = () => {
    // Send a POST request to add the new movie
    if (selectedMovie) {
      (async () => {
        try {
          const responseData = await updateMovie(selectedMovie.id, editedMovieData);
          //setMovies([...movies, responseData]);
          // Update the movies state with the edited movie data
          setMovies((prevMovies) => {
            const updatedMovies = prevMovies.map((movie) =>
              movie.id === selectedMovie.id ? { ...movie, ...responseData } : movie
            );
            return updatedMovies;
          });
          setOpenEditDialog(false);
          console.log("responseData:", responseData);
          console.log("Edit movie successful!");
          alert('修改電影成功');
          //navigate('/');
        } catch (error) {
          console.log(error);
        }
      })();
    }
  };
  const handleDeleteMovie = ()=>{
     // Send a DELETE request to delete the movie
     if (selectedMovie) {
      (async () => {
        try {
          const responseData = await deleteMovie(selectedMovie.id);
          setMovies((prevMovies) => {
            const updatedMovies = prevMovies.filter((movie)=>movie.id!==selectedMovie.id);
            return updatedMovies;
          });
          setOpenDeleteDialog(false);
          console.log("responseData:", responseData);
          console.log("Delete movie successful!");
          alert('刪除電影成功');
          //navigate('/');
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }
  // Function to open the edit dialog
  // const openEditDialogFunc = (movie: Movie) => {
  //   setSelectedMovie(movie); // Set the selected movie for editing
  //   setEditedMovieData(movie);
  //   setOpenEditDialog(true); // Open the edit dialog
  // };

  // Function to open the edit dialog
  const handleEditForMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setEditedMovieData(movie);
    setOpenEditDialog(true); // Open the edit dialog
  };
  const handleDeleteForMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    //setEditedMovieData(movie);
    setOpenDeleteDialog(true); // Open the edit dialog
  };
  
  const handleAddForMovie = () => {
    setFormData({
      title: '',
      description: '',
      releaseDate: '',
      status: '',
      genre: '',
      level: '',
      coverUrl: '',
    });
    setOpenAddDialog(true);
  }
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
    navigate(`/Admin/Sessions?movie=${movie.id}`, { state: { movie: movie } });
  };
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  };
  return (
    <div>
      {/* <Typography variant="h6" gutterBottom>
        電影管理
      </Typography>
      <Button variant="outlined" color="primary" onClick={() => handleAddForMovie()}>
        Add Movie
      </Button> */}
      {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Typography variant="h6" gutterBottom style={{ display: 'flex', alignItems: 'center' }}>
        電影管理
        <Button variant="outlined" color="primary" onClick={() => handleAddForMovie()}>
          新增電影
        </Button>
      </Typography>
      </div> */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
          {/* <TableRow> */}
        {/* <TableCell  style={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom style={{ textAlign: 'center' }}>
            電影管理
          </Typography>
        </TableCell> */}
        <TableCell colSpan={7} style={{ textAlign: 'left' }}>
        <Button variant="outlined" color="primary" onClick={() => handleAddForMovie()}
           >
          新增電影
        </Button>
        </TableCell>
      {/* </TableRow> */}
          {/* <Typography variant="h6" gutterBottom style={{ display: 'flex', alignItems: 'center' }}>
        電影管理
      </Typography> */}
      
          </TableHead>
          <TableBody>
            <TableRow >
              <TableCell>電影封面</TableCell>
              <TableCell>電影名稱</TableCell>
              <TableCell>電影介紹</TableCell>
              <TableCell>上映日期</TableCell>
              <TableCell>上映狀態</TableCell>
              <TableCell>類型</TableCell>
              <TableCell>級別</TableCell>
            </TableRow>
            {movies.map((movie) => (
              <TableRow key={movie.id}>
                <Box flex="1" marginRight={4}>
                  <img
                    src={movie.coverUrl}
                    style={{
                      width: "120px",
                      height: "auto",
                    }}
                  />
                </Box>
                <TableCell>{movie.title}</TableCell>
                <TableCell>
                  {/* <Typography variant="body1" color="textPrimary" style={{ overflow: "hidden", textOverflow: "ellipsis" }}> */}
                  {truncateText(movie.description, 150)} {/* Adjust the maximum length */}
                  {/* </Typography> */}
                </TableCell>
                <TableCell>
                  {movie.releaseDate}
                </TableCell>
                <TableCell>
                  {movie.status}
                </TableCell>
                <TableCell>
                  {movie.genre}
                </TableCell>
                <TableCell>
                  {movie.level}
                </TableCell>

                <TableCell>
                  <Button variant="outlined"
                    color="primary"
                    onClick={() => handleEditForMovie(movie)}
                  >
                    修改電影
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleAddSessionForMovie(movie)}
                  >
                    修改場次
                  </Button>
                  <Button variant="outlined"
                    color="primary"
                    onClick={() => handleDeleteForMovie(movie)}
                  >
                    刪除電影
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Movie Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>新增電影</DialogTitle>
        <DialogContent>
          {/* Add Movie Form */}
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <TextField
              label="電影名稱"
              fullWidth
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              label="電影介紹"
              fullWidth
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <FormControl fullWidth>
              <Typography variant="body2" style={{ fontSize: '15px', marginLeft: '10px', color: 'gray' }}>上映日期</Typography>
              <TextField
                //label="ReleaseDate"
                id="releaseDate"
                fullWidth
                required
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                type="date" // Set the input type to "date"
                InputProps={{
                  inputProps: {
                    min: '1000-01-01', // Minimum date allowed (adjust as needed)
                    max: '9999-12-31', // Maximum date allowed (adjust as needed)
                  },
                }}
                // Add a placeholder as a hint for the desired format
                placeholder="YYYY/MM/DD"
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="statusLabel">上映狀態</InputLabel>
              <Select
                labelId="statusLabel"
                id="status"
                name="status"
                sx={{ width: 110 }}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                size="small"
                style={{ marginBottom: '0px' }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="RELEASED">RELEASED</MenuItem>
                <MenuItem value="UPCOMING">UPCOMING</MenuItem>
                <MenuItem value="ARCHIEVED">ARCHIEVED</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="genreLabel">類型</InputLabel>
              <Select
                labelId="genreLabel"
                id="genre"
                name="genre"
                sx={{ width: 110 }}
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                size="small"
                style={{ marginLeft: '0px' }}
              >
                <MenuItem value="">All</MenuItem>
                {Genre.map((genre) => (
                  <MenuItem value={genre}>{genre}</MenuItem>
                ))
                }
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="levelLabel">級別</InputLabel>
              <Select
                labelId="levelLabel"
                id="level"
                name="level"
                sx={{ width: 110 }}
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                size="small"
                style={{ marginLeft: '0px' }}
              >
                <MenuItem value="">All</MenuItem>
                {Level.map((level) => (
                  <MenuItem value={level}>{level}</MenuItem>
                ))
                }
              </Select>
            </FormControl>
            <TextField
              label="電影封面連結"
              fullWidth
              required
              value={formData.coverUrl}
              onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
            />

          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddMovie} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit Movie Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit Movie</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            required
            value={editedMovieData.title}
            onChange={(e) => setEditedMovieData({ ...editedMovieData, title: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            required
            value={editedMovieData.description}
            onChange={(e) => setEditedMovieData({ ...editedMovieData, description: e.target.value })}
          />
          <FormControl fullWidth>
            <Typography variant="body2" style={{ fontSize: '15px', marginLeft: '10px', color: 'gray' }}>上映日期</Typography>
            <TextField
              //label="ReleaseDate"
              id="releaseDate"
              fullWidth
              required
              value={editedMovieData.releaseDate}
              onChange={(e) => setEditedMovieData({ ...editedMovieData, releaseDate: e.target.value })}
              type="date" // Set the input type to "date"
              InputProps={{
                inputProps: {
                  min: '1000-01-01', // Minimum date allowed (adjust as needed)
                  max: '9999-12-31', // Maximum date allowed (adjust as needed)
                },
              }}
              // Add a placeholder as a hint for the desired format
              placeholder="YYYY/MM/DD"
            />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="levelLabel">級別</InputLabel>
            <Select
              labelId="levelLabel"
              id="level"
              name="level"
              value={editedMovieData.level}
              onChange={(e) => setEditedMovieData({ ...editedMovieData, level: e.target.value })}
              size="small"
              style={{ marginLeft: '0px' }}
            >
              <MenuItem value="">All</MenuItem>
              {Level.map((level) => (
                <MenuItem value={level}>{level}</MenuItem>
              ))
              }
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="genreLabel">類型</InputLabel>
            <Select
              labelId="genreLabel"
              id="genre"
              name="genre"
              value={editedMovieData.genre}
              onChange={(e) => setEditedMovieData({ ...editedMovieData, genre: e.target.value })}
              size="small"
              style={{ marginLeft: '0px' }}
            >
              <MenuItem value="">All</MenuItem>
              {Genre.map((genre) => (
                <MenuItem value={genre}>{genre}</MenuItem>
              ))
              }
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="statusLabel">上映狀態</InputLabel>
            <Select
              labelId="statusLabel"
              id="status"
              name="status"
              value={editedMovieData.status}
              onChange={(e) => setEditedMovieData({ ...editedMovieData, status: e.target.value })}
              size="small"
            //style={{ marginBottom: '0px' }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="RELEASED">RELEASED</MenuItem>
              <MenuItem value="UPCOMING">UPCOMING</MenuItem>
              <MenuItem value="ARCHIEVED">ARCHIEVED</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="CoverUrl"
            fullWidth
            required
            value={editedMovieData.coverUrl}
            onChange={(e) => setEditedMovieData({ ...editedMovieData, coverUrl: e.target.value })}
          />
          {/* Add more form fields here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditMovie} color="primary">
            Edit
          </Button>
        </DialogActions>
      </Dialog>
       {/* Delete Movie Dialog */}
       <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Delete Movie</DialogTitle>
        <DialogContent>
          確定要刪除電影 "{selectedMovie?.title}" 嗎?
          {/* Add more form fields here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteMovie} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// export default AdminMovieManagement;
