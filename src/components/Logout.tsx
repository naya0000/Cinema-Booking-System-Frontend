import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const api = 'http://localhost:8080';

export default function Logout() {
  const token = sessionStorage.getItem('token');//get item from session should be implemented inside the export function
  const navigate = useNavigate();
  //console.log(token);
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.post(
          `${api}/users/logout`, null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response);
        if (response.status === 200) {
          sessionStorage.removeItem('token');// Token invalidated successfully
          sessionStorage.removeItem('user_id');
          sessionStorage.removeItem('username');
          console.log('Success to logout');
          navigate('/');//To Home Page
          // You may want to redirect to the login page or update the UI as needed
        } else {
          console.error('Failed to logout');
        }
      } catch (error) {
        throw error;
        // if (error.response.status === 401) {
        //   console.log('error 401');
        //   navigate('/accessdenied');
        // } else {
        //   console.log('other error');
        // }
      };
    })();
  })


  return null;
};

