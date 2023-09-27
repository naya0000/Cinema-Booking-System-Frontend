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
import { Margin } from '@mui/icons-material';
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
const BASE_URL = 'http://localhost:8080';
const Genre = ['喜劇片', '動作片', '恐怖片', '懸疑片', '紀錄片', '愛情片', '動漫片', '科幻片', '劇情片'];
const Level = ['普遍級', '保護級', '輔導級', '限制級'];
export default function AdminMovie() {
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movies1, setMovies1] = useState<Movie[]>([]);
  const [change, setChange] = useState(0);
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
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const today_new = today.toISOString().split('T')[0];

  useEffect(() => {
    axios.get(`${BASE_URL}/movies`)
      .then((response) => {
        //if (response.status === 200) {
        // alert("get movies successful");
        // console.log("test:");
        setMovies(response.data);
        setMovies1(response.data);
        // console.log("test1:");
        // Dynamically update the status based on releaseDate
        setChange(1);

        // }
      }).catch((error) => {
        // if (error.response.status === 404) {
        alert(error.response.data);
        //   }
      });
  }, [])
  useEffect(() => {
    // console.log("test:");
    const updateMoviesStatus = async () => {
      try {
        // console.log("test1:");
        const updatedMovies = await Promise.all(
          movies.map(async (movie) => {
            const releaseDateParts = movie.releaseDate.split('-');
            const releaseDateTime = new Date(
              parseInt(releaseDateParts[0]),
              parseInt(releaseDateParts[1]) - 1,
              parseInt(releaseDateParts[2]) + 1
            );
            const releaseDateTime1 = releaseDateTime.toISOString().split('T')[0];
            //console.log("releaseDateTime1:",releaseDateTime1);

            const today = new Date();
            today.setDate(today.getDate() + 1);
            const today1 = today.toISOString().split('T')[0];

            // console.log("today1:",today1);

            if (releaseDateTime1 <= today1 && movie.status !== 'RELEASED') {
              // Update status to RELEASED

              await axios.post(`${BASE_URL}/movies/updateStatus`, {
                id: movie.id,
                status: 'RELEASED'
              }, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
              }).then((response) => {
                // console.log("releaseDateTime:", releaseDateTime1);
                // console.log("today:", today1);
                // console.log("update status to RELEASED");
              }).catch((error) => {
                console.log(error);
              })
              return { ...movie, status: 'RELEASED' };
            } else if (releaseDateTime1 > today1 && movie.status !== 'UPCOMING') {

              // Update status to UPCOMING
              await axios.post(`${BASE_URL}/movies/updateStatus`, {
                id: movie.id,
                status: 'UPCOMING'
              }, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
              }).then((response) => {
                // console.log("releaseDateTime:", releaseDateTime1);
                // console.log("today:", today1);
                // console.log("update status to UPCOMING");
              }).catch((error) => {
                console.log(error);
              })
              return { ...movie, status: 'UPCOMING' };
            } else {
              return { ...movie };
            }
          })
        );

        setMovies(updatedMovies);
      } catch (error) {
        console.log(error);
      }
    };

    updateMoviesStatus();
  }, [token, movies1]);

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
          const responseData = await updateMovie(selectedMovie.id, formData);
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
  const handleDeleteMovie = () => {
    // Send a DELETE request to delete the movie
    if (selectedMovie) {
      (async () => {
        try {
          const responseData = await deleteMovie(selectedMovie.id);
          setMovies((prevMovies) => {
            const updatedMovies = prevMovies.filter((movie) => movie.id !== selectedMovie.id);
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
  const handleEditForMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setFormData(movie);
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
  const handleReleaseDateChange = (releaseDate: string) => {
    // const releaseDateParts = releaseDate.split('-');
    // const releaseDateTime = new Date(
    //   parseInt(releaseDateParts[0]),
    //   parseInt(releaseDateParts[1]) - 1,
    //   parseInt(releaseDateParts[2]) + 1
    // );
    // const releaseDateTimes = releaseDateTime.toISOString().split('T')[0];
    // const today = new Date();
    // today.setDate(today.getDate() + 1);
    // const today_new = today.toISOString().split('T')[0];
    // console.log(today_new);
    // Check if the release date is after today
    if (releaseDate > today_new) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        status: 'UPCOMING',
        releaseDate: releaseDate,
      }));
    } else {
      // If the release date is on or before today, set the status to RELEASED
      setFormData((prevFormData) => ({
        ...prevFormData,
        status: 'RELEASED', // or another appropriate status
        releaseDate: releaseDate,
      }));
    }
  };
  const releaseDateCheck = (releaseDate: string) => {
    const releaseDateParts = releaseDate.split('-');
    const releaseDateTime = new Date(
      parseInt(releaseDateParts[0]),
      parseInt(releaseDateParts[1]) - 1,
      parseInt(releaseDateParts[2]) + 1
    );
    const releaseDateTimes = releaseDateTime.toISOString().split('T')[0];

    console.log("today_new", today_new);
    if (releaseDateTimes <= today_new) {
      console.log("false");
      return false;
    } else {
      return true;
    }
  }

  return (
    <div>
      <Typography variant="h6" marginTop={4} marginLeft={2}>
        電影管理
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableCell colSpan={7} style={{ textAlign: 'left' }} >
              <Button style={{ marginTop: '0px' }} variant="outlined" color="primary" onClick={() => handleAddForMovie()}
              >
                新增電影
              </Button>
            </TableCell>
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
                  {movie.status==='RELEASED'?'熱映中':movie.status==='UPCOMING'?'即將上映':'已下檔'}
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
                    disabled={!releaseDateCheck(movie.releaseDate)}
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
              sx={{ marginTop: "13px" }}
              label="電影名稱"
              fullWidth
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              sx={{ marginTop: "13px" }}
              label="電影介紹"
              fullWidth
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <FormControl fullWidth>
              <Typography variant="body2" style={{ fontSize: '15px', marginLeft: '10px', marginTop: '10px', color: 'gray' }}>上映日期</Typography>
              <TextField
                //label="ReleaseDate"
                id="releaseDate"
                fullWidth
                required
                value={formData.releaseDate}
                onChange={(e) => {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    releaseDate: e.target.value,
                  }));
                  handleReleaseDateChange(e.target.value);
                }}
                // onChange={(e) => 
                //   setFormData({ ...formData, releaseDate: e.target.value })}
                type="date" // Set the input type to "date"
                InputProps={{
                  inputProps: {
                    min: today_new, // Minimum date allowed (adjust as needed)
                    max: '9999-12-31', // Maximum date allowed (adjust as needed)
                  },
                }}
                // Add a placeholder as a hint for the desired format
                placeholder="YYYY/MM/DD"
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120, marginTop: '10px', marginLeft: '-1px', }}>
              <InputLabel id="statusLabel">上映狀態</InputLabel>
              <Select
                labelId="statusLabel"
                id="status"
                name="status"
                sx={{ width: 150 }}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                size="small"
                style={{ marginBottom: '0px' }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="RELEASED">熱映中</MenuItem>
                <MenuItem value="UPCOMING">即將上映</MenuItem>
                {/* <MenuItem value="ARCHIEVED">已下檔</MenuItem> */}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120, marginTop: '10px' }}>
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
            <FormControl sx={{ m: 1, minWidth: 120, marginTop: '10px' }}>
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
        <DialogTitle>修改電影資訊</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ margin: '10px 0' }}
            label="片名"
            fullWidth
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          //disabled={!releaseDateCheck()}
          />
          <TextField
            sx={{ margin: '10px 0' }}
            label="介紹"
            fullWidth
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <FormControl fullWidth>
            <Typography variant="body2" style={{ marginLeft: '10px', color: 'gray' }}>上映日期</Typography>
            <TextField
              //label="ReleaseDate"
              sx={{ margin: '10px 0' }}
              id="releaseDate"
              fullWidth
              required
              value={formData.releaseDate}
              onChange={(e) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  releaseDate: e.target.value,
                }));
                handleReleaseDateChange(e.target.value);
              }}
              // onChange={(e) => setEditedMovieData({ ...editedMovieData, releaseDate: e.target.value })}
              type="date" // Set the input type to "date"
              InputProps={{
                inputProps: {
                  min: today_new, // Set the minimum date to today
                  max: '9999-12-31', // Maximum date allowed 
                },
              }}
              //disabled={!releaseDateCheck()}
              // Add a placeholder as a hint for the desired format
              placeholder="YYYY/MM/DD"
            />
          </FormControl>
          <FormControl sx={{ mt: 1, mr: 2, minWidth: 120 }}>
            <InputLabel id="levelLabel" >級別</InputLabel>
            <Select
              sx={{ margin: '10px 0' }}
              labelId="levelLabel"
              id="level"
              name="level"
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
          <FormControl sx={{ mt: 1, mr: 2, minWidth: 120 }}>
            <InputLabel id="genreLabel">類型</InputLabel>
            <Select
              sx={{ margin: '10px 0' }}
              labelId="genreLabel"
              id="genre"
              name="genre"
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
          <FormControl sx={{ mt: 1, mr: 2, minWidth: 120 }}>
            <InputLabel id="statusLabel">上映狀態</InputLabel>
            <Select
              sx={{ margin: '10px 0' }}
              labelId="statusLabel"
              id="status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              size="small"
            //disabled={!releaseDateCheck()}
            //style={{ marginBottom: '0px' }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="RELEASED">RELEASED</MenuItem>
              <MenuItem value="UPCOMING">UPCOMING</MenuItem>
              <MenuItem value="ARCHIEVED">ARCHIEVED</MenuItem>
            </Select>
          </FormControl>
          <TextField
            sx={{ marginTop: '10px' }}
            label="封面"
            fullWidth
            required
            value={formData.coverUrl}
            onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
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
