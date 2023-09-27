import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios, { AxiosError } from 'axios';
import { log } from 'console';
import { useNavigate } from 'react-router-dom';


const initialFormData = {
  name: '',
  password: '',
  confirmPassword: '',
  username: '',
  phoneNumber: '',
};
const api = 'http://localhost:8080';

export default function UserSignUp() {
  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Check if the username or password field is empty
    if (!formData.username || !formData.password || !formData.name || !formData.confirmPassword || !formData.phoneNumber) {
      alert('請填寫完整資料'); // Provide a meaningful error message
      return; // Exit the function without making the axios request
    }
    if (formData.password !== formData.confirmPassword) {
      alert('密碼確認錯誤，請重新註冊。');
      return;
    }
    // register new user
    axios.post(`${api}/auth`, {
      name: `${formData.name}`,
      password: `${formData.password}`,
      username: `${formData.username}`,
      phoneNumber: `${formData.phoneNumber}`,
    })
      .then((response) => {
        //console.log(response);
        if (response.status === 201) {
          alert(`${formData.username} ${response.data}\n 即將導向影城首頁`);
          navigate('/');
        }
      })
      .catch(
        (error) => {
          if (error.response.status === 400) {
            alert(error.response.data);
          }
        }
      )

    //alert(`Name:${formData.name}\nPassword: ${formData.password}\nEmail:${formData.username}\nphoneNumber:${formData.phoneNumber}`);
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
          用戶註冊
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
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
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="username"
            label="帳號(電子郵件)"
            type="email"
            id="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="密碼"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="確認密碼"
            type="password"
            id="confirmPassword"
            autoComplete="confirm-password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="phoneNumber"
            label="電話"
            type="phoneNumber"
            id="phoneNumber"
            autoComplete="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            註冊
          </Button>
        </Box>
      </Box>
    </Container>
  );
}


