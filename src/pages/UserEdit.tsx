import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = 'http://localhost:8080';

export default function UserEdit() {
  const initialUserData = {
    name:'',
    username: '', // Add more user-related fields here
    password: '',
  };

  const [userData, setUserData] = useState(initialUserData);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from the server and set it in userData state
    // You can use the user_id stored in sessionStorage to fetch the user's data
    const id = sessionStorage.getItem('user_id');

    if (id) {
      axios.get(`${api}/users/id?id=${id}`)
        .then((response) => {
          if (response.status === 200) {
            const user = response.data;
            console.log("user:",user);
            setUserData({
              name: user.name,
              username: user.username, // Add more user-related fields here
              password:user.password,
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  const handleChange = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const userId = sessionStorage.getItem('user_id');
    if (userId) {
      axios.put(`${api}/users/${userId}`, userData)
        .then((response) => {
          if (response.status === 200) {
            console.log('User data updated successfully');
            // Redirect to the user profile or another page after successful update
            navigate('/Member'); // Change the path as needed
          }
        })
        .catch((error) => {
          console.error('Error updating user data:', error);
        });
    }
  };

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
          Edit User Information
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
            value={userData.username}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={userData.name}
            onChange={handleChange}
          />
          {/* Add more fields for other user information */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
