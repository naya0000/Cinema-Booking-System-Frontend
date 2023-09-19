import React, { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { log } from 'console';
import { fetchUserByUsername } from '@/services/api';


const api = 'http://localhost:8080';

export default function UserLogin() {
  const initialFormData = {
    username: '',
    password: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  useEffect(()=>{
    setIsAuthenticated(!!token);
  }, [token]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSuccessfulLogin = (token: string, username: string) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('username', username);
    setIsAuthenticated(!!token);

    // Decode the JWT token to access the username
    const decodedToken: { sub: string, iat: number, exp: number } = jwt_decode(token);
    // const username = decodedToken.sub;

    (async () => {
      try {
        const User = await fetchUserByUsername(username);
        sessionStorage.setItem('user_id', User.id);
        console.log("User:", User);
      } catch (error) {
        console.log(error);
      }
    })();

    // Navigate to the '/movies' route
    //navigate('/movies');
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { 
    event.preventDefault();
    axios.post(`${api}/users/login`, {
      username: `${formData.username}`,
      password: `${formData.password}`,
    })
      .then(async (response) => {
        //console.log("Inside axios response");
        console.log(response);
        if (response.status === 200) {
          console.log("Login successfull");
          // Assuming the backend returns a JWT token
          const token = response.data.accessToken;
          console.log("token: ", token);
          handleSuccessfulLogin(token, formData.username);
        }
      })
      .catch(error => {
        if (error.response.status === 401) {
          console.log('Invalid email or password');
          navigate('/accessdenied');
        } else {
          console.log('An error occurred while logging in');
        }
      });
  };
  useEffect(() => {
    if (isAuthenticated) {
      // User is already authenticated, redirect to '/movies'
      navigate('/Booking');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          User Login
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
// export default UserLogin;


