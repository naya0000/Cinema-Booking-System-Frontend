// src/components/UserManagement.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Delete, Edit, Lock, LockOpen } from '@mui/icons-material';
import axios from 'axios';
import { fetchAllUsers, updateUserStatus } from '@/services/api';

interface User {
  id: number;
  name: string;
  username: string;
  phoneNumber: string;
  locked: boolean;
  // status: string;
}
const api = 'http://localhost:8080';
const token = sessionStorage.getItem('token');

export default function AdminUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    username: '',
    //password: '',
    phoneNumber: '',
  });
  const [newPassword, setNewPassword] = useState('');
  useEffect(()=>{
    axios.get(`${api}/users`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      if (response.status === 200) {
        setUsers(response.data);
      }
    }).catch((error) => {
      alert(error.response.message);
    })
  },[]);
 

  const fetchUserById = (id: number) => {
    // if (id) {
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
            id: user.id,
            name: user.name,
            username: user.username, // Add more user-related fields here
            // password: user.password,
            phoneNumber: user.phoneNumber,
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
    // }
  }
  const openDeleteUserDialog = (userId: number) => {
    setOpenDeleteDialog(true);
    setSelectedId(userId);
    // fetchUserById(userId);
  };
  const openEditUserDialog = (userId: number) => {
    setOpenEditDialog(true);
    fetchUserById(userId);
  };
  const openEditPasswordDialog = (userId: number) => {
    setNewPassword('');
    setOpenPasswordDialog(true);
    setSelectedId(userId);
    // fetchUserById(userId);
  };
  const closeEditUserDialog = () => {
    setOpenEditDialog(false);
  };
  const closeDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  const closePasswordDialog = () => {
    setOpenPasswordDialog(false);
  };
  const toggleLock = async (userId: number, locked: boolean) => {
    // Implement the logic to toggle user account lock status
    // You can send a PUT request to your API to update the user's lock status
    try {
      const response = await updateUserStatus(userId, locked);
      if (response.status === 200) {
        setUsers((preUsers) => {
          const updatedUsers = preUsers.map((user) =>
            user.id === userId ? { ...user, ...response.data } : user
          );
          alert(`${locked?'凍結該用戶帳號成功':'恢復該用戶帳號成功'}`);
          console.log("Admin Change Account Locked Success");
          return updatedUsers;
        });
      }
    } catch (error) {

      console.log(error);
    }

  };
  const handleDeletePassword=()=>{
    axios.post(`${api}/users/delete`, //AUTH
     selectedId
    ,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      .then((response) => {
        closeDeleteDialog();
        if (response.status === 200) {
          //console.log('刪除用戶成功');
          alert('刪除用戶成功');
          setUsers((prevUsers) =>
          prevUsers.filter((user) =>
            user.id !== selectedId
          )
        );
        }
      })
      .catch((error) => {
        alert(error.response.message);
        console.error('刪除用戶失敗:', error);
      });
  }
  const handleEditUser = () => {
    axios.put(`${api}/users/id`, { //AUTH
      id: userData.id,
      // username: userData.username,
      // password: userData.password,
      name: userData.name,
      phoneNumber: userData.phoneNumber,
    },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        closeEditUserDialog();
        if (response.status === 200) {
          console.log('User data updated successfully');
          alert('更新用戶資訊成功');
        }
      })
      .catch((error) => {
        alert(error.response.message);
        console.error('Password reset failed:', error);
      });
  };
  const handleEditPassword = () => {
    axios.put(`${api}/auth/password/byAdmin`, { //AUTH
      id: selectedId,
      // username: userData.username,
    
      newPassword: newPassword,
      // name: userData.name,
      // phoneNumber: userData.phoneNumber,
    },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        closePasswordDialog();
        if (response.status === 200) {
          console.log('User data updated successfully');
          alert('更新用戶密碼成功');
        }
      })
      .catch((error) => {
        alert(error.response.message);
        console.error('Password reset failed:', error);
      });
  };

  return (<>
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Box py={2}>
        <Typography variant="h5" gutterBottom marginTop={3}>
          會員管理
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>帳號</TableCell>
              <TableCell>用戶名稱</TableCell>
              <TableCell>用戶電話</TableCell>
              <TableCell>帳號狀態</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>
                  {user.locked ? (
                    <>
                      凍結
                      <IconButton
                        onClick={() => toggleLock(user.id, false)}
                        color="secondary"
                      >
                        <Lock />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      正常
                      <IconButton
                        onClick={() => toggleLock(user.id, true)}
                        color="primary"
                      >
                        <LockOpen />
                      </IconButton>
                    </>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => openEditUserDialog(user.id)}
                    startIcon={<Edit />}
                    size="small"
                  >
                    修改用戶
                  </Button>
                  <Button
                    onClick={() => openEditPasswordDialog(user.id)}
                    startIcon={<Edit />}
                    size="small"
                  >
                    更改密碼
                  </Button>
                  <Button
                    onClick={() => openDeleteUserDialog(user.id)}
                    startIcon={<Delete />}
                    size="small"
                    color="error"
                  >
                    刪除用戶
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
    <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
      <DialogTitle >修改用戶資料</DialogTitle>
      <DialogContent >
        <TextField
          sx={{margin:'10px 0'}}
          label="用戶名稱Name"
          fullWidth
          required
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
        <TextField
          label="電話號碼Phone Number"
          fullWidth
          required
          value={userData.phoneNumber}
          onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenEditDialog(false)}>
          Cancel
        </Button>
        <Button onClick={() => handleEditUser()}
          color="primary"
        //disabled={!textField}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
    <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
      <DialogTitle>修改用戶密碼</DialogTitle>
      <DialogContent>
        <TextField
          label="密碼Password"
          sx={{margin:'10px 0'}}
          fullWidth
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenPasswordDialog(false)}>
          Cancel
        </Button>
        <Button onClick={() => handleEditPassword()}
          color="primary"
        //disabled={!textField}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
    <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
      <DialogTitle>確定要刪除該用戶嗎?
      </DialogTitle>
      {/* <DialogContent>
        <TextField
          label="密碼Password"
          fullWidth
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </DialogContent> */}
      <DialogActions>
        <Button onClick={() => setOpenDeleteDialog(false)}>
          取消
        </Button>
        <Button onClick={() => handleDeletePassword()}
          color="primary"
        //disabled={!textField}
        >
          確定
        </Button>
      </DialogActions>
    </Dialog>
  </>
  );
};


