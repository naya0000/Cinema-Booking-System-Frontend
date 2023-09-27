import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Container, Box } from '@mui/material';

export default function MemberPage() {
  const user_id = sessionStorage.getItem('user_id') || '';
  const username = sessionStorage.getItem('username') || '';
  const name = sessionStorage.getItem('name') || '';
  return (
    <Container>
      <Box mt={7}>
        <Typography variant="h5" gutterBottom>
          歡迎, {name}!
        </Typography>
        <Button component={Link} to="/Member/OrderHistory" variant="contained" color="primary" size="large" sx={{ marginRight: 2 }}>
          訂單查詢
        </Button>
        <Button component={Link} to="/Member/Edit" variant="contained" color="secondary" size="large" sx={{ marginRight: 2 }}>
          編輯會員資料
        </Button>
        <Button component={Link} to="/Member/Password" variant="contained" color="secondary" size="large">
          重設密碼
        </Button>
      </Box>
    </Container>
  );
};


