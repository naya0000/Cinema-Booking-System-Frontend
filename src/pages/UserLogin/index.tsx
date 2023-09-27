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

const BASE_URL = 'http://localhost:8080';
export default function UserLogin() {
  const initialFormData = {
    username: '',
    password: '',
    loginType: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSuccessfulLogin = (token: string, username: string) => {
    const decodedToken: { userId: number, name:string,username: string, sub: string, iss: number, exp: number, roles: string[] } = jwt_decode(token || '');
    sessionStorage.setItem('user_id', decodedToken.userId.toString());
    sessionStorage.setItem('roles', decodedToken.roles[0]);
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('name', decodedToken.name);
    setIsAuthenticated(!!token);
    navigate('/');
    // Decode the JWT token to access the username
    //const decodedToken: {username:string, sub: string, iss: number, exp: number,roles:string[]} = jwt_decode(token||'');

    // const username = decodedToken.sub;

    // axios.get(`${BASE_URL}/users/${username}`, //AUTH
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${token}`

    //     },
    //   }
    // ).then((response) => {
    //   console.log("logged in:", response.data);
    //   sessionStorage.setItem('user_id', response.data.id);
    // }).catch((error) => {
    //   console.log("error: ", error);
    // })

    // (async () => {
    //   try {
    //     const User = await fetchUserByUsername(username);
    //     sessionStorage.setItem('user_id', User.id);
    //     console.log("User:", User);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // })();

    // Navigate to the '/movies' route

  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if the username or password field is empty
  if (!formData.username || !formData.password) {
    alert('請填寫用戶名稱和密碼'); // Provide a meaningful error message
    return; // Exit the function without making the axios request
  } 
    axios.post(`${BASE_URL}/auth/UserLogin`, { //判斷是否空值
      username: `${formData.username}`,
      password: `${formData.password}`,
      loginType: 'ROLE_USER',
    })
      .then(async (response) => {
        //console.log("Inside axios response");
        console.log(response);
        if (response.status === 200) {
          alert('登入成功'); // dialog
          // console.log("Login successfull");
          // Assuming the backend returns a JWT token
          const token = response.data.token;
          // console.log("token: ", token);
          handleSuccessfulLogin(token, formData.username);
        }
      })
      .catch(error => {
        if (error.response.status === 401) {
          console.log('Invalid email or password');
          //navigate('/accessdenied');
        } else {
          console.log('An error occurred while logging in');
        }
        alert(`登入失敗`);
      });
  };
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     // User is already authenticated, redirect to '/movies'
  //     navigate('/Booking');
  //   }
  // }, [isAuthenticated, navigate]);
  // Function to handle navigation to the registration page
  const handleRegisterClick = () => {
    navigate('/Member/Signup'); // Change '/registration' to the actual registration page path
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
          用戶登入
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username (Email)"
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
            sx={{ mt: 3, mb: 2 ,  backgroundColor: '#930059',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#ff007f', // Change color on hover
            },
            '&:active': {
              backgroundColor: '#5c0033', // Change color when clicked
            },}}
          >
           登 入
          </Button>
          <Typography component="h6" variant="h5" marginTop={3}/>
         還沒有會員嗎? 
          {/* Registration button */}
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2, mb: 2 ,  backgroundColor: '#930059',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#ff007f', // Change color on hover
            },
            '&:active': {
              backgroundColor: '#5c0033', // Change color when clicked
            },
          }}
            onClick={handleRegisterClick}

          >
            註冊會員
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
// export default UserLogin;


