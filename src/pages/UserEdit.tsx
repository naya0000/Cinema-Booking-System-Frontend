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
const token = sessionStorage.getItem('token');
export default function UserEdit() {
  
  const navigate = useNavigate();
  const id = sessionStorage.getItem('user_id');
  const initialUserData = {
    id:id,
    name: '',
    //username: '', 
    password: '',
    phoneNumber: '',
    locked:0,
    //status: ''
  };
  const [userData, setUserData] = useState(initialUserData);

  useEffect(() => { //get initial user data
    if (id) {
      axios.post(`${api}/users/id`,  //AUTH
        `${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const user = response.data;
            console.log("user:", user);
            setUserData({
              id:id,
              name: user.name,
              //username: user.username, // Add more user-related fields here
              password: user.password,
              phoneNumber: user.phoneNumber,
              locked: user.locked,
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [token]);

  const handleChange = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const userId = sessionStorage.getItem('user_id');
    if (userId) {
      axios.put(`${api}/users/id`, userData, //USER
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }) 
        .then((response) => {
          if (response.status === 200) {
            console.log('User data updated successfully');
            alert('更新會員資料成功');
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
          更新會員資料
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {/* <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="帳號"
            name="username"
            autoComplete="username"
            autoFocus
            value={userData.username}
            onChange={handleChange}
          /> */}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="姓名"
            name="name"
            autoComplete="name"
            autoFocus
            value={userData.name}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="電話"
            name="phoneNumber"
            autoComplete="phoneNumber"
            autoFocus
            value={userData.phoneNumber}
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
