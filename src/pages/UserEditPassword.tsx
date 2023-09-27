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
export default function UserEditPassword() {
  const initialUserData = {
    name:'',
    username:'',
    password: '', 
    newPassword: '',
    confirmPassword: '',
  };

  const [userData, setUserData] = useState(initialUserData);
  const navigate = useNavigate();

  useEffect(() => {
    const id = sessionStorage.getItem('user_id');

    if (id) { //get initial user data
      axios.post(`${api}/users/id`, //AUTH
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
               ...userData,
              name: user.name,
              username: user.username,
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
      // Check if newPassword and confirmPassword match
      if (userData.newPassword !== userData.confirmPassword) {
        alert('密碼確認錯誤');
        return;
      }
       // Send a request to update the user's password
      axios.put(`${api}/auth/password`,  { //AUTH
        id: userId,
        username:userData.username,
        password: userData.password, // Current password
        newPassword: userData.newPassword, // New password
      },
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
      {/* <Typography component="h5" variant="h5"> 
      姓名: {userData.name}
      </Typography>
      <Typography component="h5" variant="h5"> 
      帳號: {userData.username}
      </Typography> */}
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          重設密碼
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="原始密碼"
            name="password"
            type="password"
            autoComplete="password"
            autoFocus
            value={userData.password}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="newPassword"
            label="新密碼"
            name="newPassword"
            type="password"
            autoComplete="newPassword"
            autoFocus
            value={userData.newPassword}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            label="新密碼確認"
            name="confirmPassword"
            type="password"
            autoComplete="confirmPassword"
            autoFocus
            value={userData.confirmPassword}
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
