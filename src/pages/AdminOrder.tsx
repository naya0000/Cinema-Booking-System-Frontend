// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TextField, Select, MenuItem, InputLabel, Checkbox, Button } from '@mui/material';
// import { fetchAllOrders, cancelOrder } from '@/services/api'; // Import your API functions
import { log } from 'console';
import { fetchAllOrders, updateCanceledStatus, updateOrderStatus } from '@/services/api';
import axios from 'axios';
interface Order {
  id: number;
  orderDate: string;
  quantity: number;
  payment: string;
  ticket: string;
  movie: string;
  startTime: string;
  sessionDate: string;
  username: string;
  seatsRow: string[];
  seatsNumber: string[];
  totalAmount: number;
  canceled: string; //user canceled order
  status: string;
}
const token = sessionStorage.getItem('token');
const BASE_URL = 'http://localhost:8080';
export default function AdminOrder() {
  const [ordersData, setOrdersData] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  const [filters, setFilters] = useState({
    orderId: '',
    username: '',
    orderDate: '',
    movie: '',
    sessionDate: '',
    startTime: '',
    status: '',
    payment: '',
    ticket: '',
    canceled: '',
  });
  useEffect(() => {
    // Fetch all orders when the component mounts
    (async () => {
      try {
        const data = await fetchAllOrders();
           // Format the orderDate property of each order in the data
      const formattedData = data.map((order:Order) => ({
        ...order,
        orderDate: formatOrderDate(order.orderDate),
      }));
        setOrdersData(formattedData);
        console.log("ordersData:", data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleCancelOrder = async (orderId: number) => { //By Admin
    try {
      const responseCanceled = await updateCanceledStatus(orderId, '管理員');
      const responseOrder = await updateOrderStatus(orderId, '已取消');
      if (responseCanceled === 200 && responseOrder===200) {
        setOrdersData((prevOrders) =>
          prevOrders.map((prevOrder) =>
            prevOrder.id === orderId ? { ...prevOrder, canceled: '管理員',status:'已取消'} : prevOrder
          )
        );
        alert('取消訂單成功');
        //navigate('/Member/OrderHistory');
      }
    } catch (error) {
      console.log(error);
    }
  };
  // const handleDeleteChange = (orderId: number) => {
  //   axios.delete(`${BASE_URL}/orders/${orderId}`,
  //     {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     }
  //   ).then((response) => {
  //     if (response.status === 200) {
  //       alert(response.data);
  //       setOrdersData((prevOrders) =>
  //         prevOrders.filter((prevOrder) =>
  //           prevOrder.id !== orderId
  //         )
  //       );
  //     }
  //   }).catch((error) => {
  //     alert(error.response.data);
  //     // console.log(error.response);
  //   })
  // }
  const handleConfirmCancel = async (orderId: number, status: string) => {
    try {
      const response = await updateOrderStatus(orderId, status);
      if (response === 200) {
        setOrdersData((prevOrders) =>
          prevOrders.map((prevOrder) =>
            prevOrder.id === orderId ? { ...prevOrder, status: status } : prevOrder
          )
        );
        alert('取消訂單成功');
        //navigate('/Member/OrderHistory');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleFilterChange = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  // Function to format the orderDate
  function formatOrderDate(orderDate: string) {
    const date = new Date(orderDate);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}, ${date.toLocaleTimeString([], {
        hour12: false, // Use 24-hour format
      })}`;
    return formattedDate;
  }
  // function formatOrderDate(orderDate: string) {
  //   const date = new Date(orderDate);
  //   const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
  //     .toString()
  //     .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}, ${date.toLocaleTimeString([], {
  //       hour12: true,
  //     })}`;
  //   return formattedDate;
  // }
  const filteredOrders = ordersData.filter((order) => {
    const {
      orderId,
      username,
      orderDate,
      movie,
      sessionDate,
      startTime,
      status,
      payment,
      ticket,
      canceled,
    } = filters;

    return (
      (!orderId || order.id.toString().includes(orderId.toLowerCase())) &&
      (!username || order.username.toLowerCase().includes(username.toLowerCase())) &&
      (!orderDate || order.orderDate.includes(orderDate)) &&
      (!movie || order.movie.toLowerCase().includes(movie.toLowerCase())) &&
      (!sessionDate || order.sessionDate.includes(sessionDate)) &&
      (!startTime || order.startTime.includes(startTime)) &&
      (!status || order.status === status) &&
      (!ticket || order.ticket === ticket) &&
      (!payment || order.payment === payment) &&
      (!canceled || order.canceled === canceled)
    );
  });
  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      // If all orders are selected, clear the selection
      setSelectedOrders([]);
    } else {
      // Otherwise, select all orders
      setSelectedOrders(filteredOrders.map((order) => order.id));
    }
  };
  const handleSelectOrder = (orderId: number) => {
    setSelectedOrders((prevSelectedOrders) => {
      if (prevSelectedOrders.includes(orderId)) {
        // If the order is already selected, remove it from the selection
        return prevSelectedOrders.filter((id) => id !== orderId);
      } else {
        // Otherwise, add it to the selection
        return [...prevSelectedOrders, orderId];
      }
    });
  };
  const handleDeleteSelected = () => {
    selectedOrders.forEach((orderId) => {
      axios.delete(`${BASE_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then((response) => {
        if (response.status === 200) {
          // Delete the order from the local state
          alert(response.data);
          setOrdersData((prevOrders) =>
            prevOrders.filter((prevOrder) =>
              prevOrder.id !== orderId
            )
          );
        }
      }).catch((error) => {
        alert(error.response.data);
        // console.log(error.response);
      });
    });

    // Clear the selected orders
    setSelectedOrders([]);
  };

  return (
    <Container >
      <Typography variant="h6" gutterBottom marginTop={4}>
        訂單管理
      </Typography>
      <Paper elevation={3} style={{ padding: '20px', width: '100%' }}>
        <TableContainer >
          <Table >
            <TableHead>
              <TableRow>
                {/* <TableCell style={{ height: '10px' }}>
                  <TextField
                    label="Id"
                    name="orderId"
                    value={filters.orderId}
                    onChange={handleFilterChange}
                    sx={{ width: 90 }}
                    size="small"
                    style={{ marginLeft: '-10px', marginBottom: '-25px' }}
                    InputLabelProps={{ style: { fontSize: 15 } }}
                  // variant="outlined"
                  />
                </TableCell> */}
                 <TableCell></TableCell>
                <TableCell>
                  <TextField
                    label="Username"
                    name="username"
                    value={filters.username}
                    onChange={handleFilterChange}
                    sx={{ width: 120 }}
                    size="small"
                    style={{ marginLeft: '-10px', marginBottom: '-25px' }}
                    InputLabelProps={{ style: { fontSize: 15 } }}
                  // variant="outlined"
                  // style={{ marginBottom: '20px' }}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    label="Movie"
                    name="movie"
                    value={filters.movie}
                    onChange={handleFilterChange}
                    sx={{ width: 120 }}
                    size="small"
                    style={{ marginLeft: '-10px', marginBottom: '-25px' }}
                    InputLabelProps={{ style: { fontSize: 15 } }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="date" // Set the input type to "date"
                    name="orderDate"
                    value={filters.orderDate}
                    onChange={handleFilterChange}
                    sx={{ width: 120 }}
                    size="small"
                    style={{ marginLeft: '-10px', marginBottom: '-25px' , minWidth:'140px'}}
                    InputLabelProps={{ style: { fontSize: 15 } }} // font size of input label
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" style={{ fontSize: '15px', marginLeft: '10px', color: 'gray' }}>Payment</Typography>
                  <Select
                    labelId="payment"
                    name="payment"
                    value={filters.payment}
                    onChange={handleFilterChange}
                    sx={{ width: 110 }}
                    size="small"
                    style={{ marginLeft: '-10px', minWidth:'130px' }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="信用卡">信用卡</MenuItem>
                    <MenuItem value="現金">現金</MenuItem>
                    <MenuItem value="LINE_PAY">LINE_PAY</MenuItem>
                  </Select>
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <TextField
                    type="date"
                    //label="Session"
                    name="sessionDate"
                    value={filters.sessionDate}
                    onChange={handleFilterChange}
                    sx={{ width: 110 }}
                    size="small"
                    style={{ marginLeft: '-10px', marginBottom: '-25px', width:'140px' }}
                    InputLabelProps={{ style: { fontSize: 15 } }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="time"
                    //label="Time"
                    name="startTime"
                    value={filters.startTime}
                    onChange={handleFilterChange}
                    sx={{ width: 110 }}
                    size="small"
                    style={{ marginLeft: '-10px', marginBottom: '-25px', width:'150px'}}
                    InputLabelProps={{ style: { fontSize: 15 } }}
                    InputProps={{
                      inputProps: {
                        step: 300, // 5 minutes interval
                        format: 'HH:mm:ss', // 24-hour format
                        allowEmpty: true, // Allow the field to be cleared
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" style={{ fontSize: '15px', marginLeft: '10px', color: 'gray' }}>Ticket</Typography>
                  <Select
                    labelId="ticket"
                    name="ticket"
                    value={filters.ticket}
                    onChange={handleFilterChange}
                    sx={{ width: 110 }}
                    size="small"
                    style={{ marginLeft: '-10px' }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="全票">全票</MenuItem>
                    <MenuItem value="優待票">優待票</MenuItem>
                  </Select>
                </TableCell>
                <TableCell></TableCell>

                <TableCell>
                  <Typography variant="body2" style={{ fontSize: '15px', marginLeft: '10px', color: 'gray' }}>Status</Typography>
                  <Select
                    labelId="status-select" // Add this line
                    // label="Status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    sx={{ width: 110 }}
                    size="small"
                    style={{ marginLeft: '-10px', minWidth:'130px'}}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="訂票成功">訂票成功</MenuItem>
                    <MenuItem value="處理中">處理中</MenuItem>
                    <MenuItem value="已完成">已完成</MenuItem>
                    <MenuItem value="已取消">已取消</MenuItem>
                    {/* Add more status options as needed */}
                  </Select>
                </TableCell>
                <TableCell>
                  {/* Select dropdown for Canceled */}
                  <Typography variant="body2" style={{ fontSize: '15px', marginLeft: '10px', color: 'gray' }}>Cancel</Typography>
                  <Select
                    labelId="canceled"
                    name="canceled"
                    value={filters.canceled}
                    onChange={handleFilterChange}
                    sx={{ width: 110 }}
                    size="small"
                    style={{ marginLeft: '-10px', minWidth:'160px' }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="管理員">管理員取消訂單</MenuItem>
                    <MenuItem value="使用者">使用者取消訂單</MenuItem>
                    <MenuItem value="未取消">未取消</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
              <TableRow >
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedOrders.length === filteredOrders.length}
                    onChange={handleSelectAll}
                  />
                </TableCell> */}
                <TableCell >訂票序號</TableCell>
                <TableCell>用戶名</TableCell>
                <TableCell>片名</TableCell>
                <TableCell>訂購日期</TableCell>
                <TableCell>付款方式</TableCell>
                <TableCell>數量</TableCell>
                <TableCell>座位</TableCell>
                <TableCell>場次日期</TableCell>
                <TableCell>場次時間</TableCell>
                <TableCell>票種</TableCell>
                <TableCell>總金額</TableCell>
                <TableCell>訂單狀態</TableCell>
                <TableCell>取消狀態</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                    />
                  </TableCell> */}
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.username}</TableCell>
                  <TableCell>{order.movie}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.payment}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>
                    {order.seatsNumber.map((number, index) => {
                      const row = order.seatsRow[index];
                      return `${row}${number}`;
                    }).join(', ')}
                  </TableCell>
                  <TableCell>{order.sessionDate}</TableCell>
                  <TableCell>{order.startTime}</TableCell>
                  <TableCell>{order.ticket}</TableCell>
                  <TableCell>{order.totalAmount}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.canceled === '使用者' ? '使用者取消訂單' : order.canceled === '管理員' ?'管理員取消訂單':''}</TableCell>
                  <TableCell>
                    {order.canceled === '使用者' && order.status === '處理中' && (
                      <button onClick={() => handleConfirmCancel(order.id, '已取消')}>取消訂單確認</button>
                    )}
                    {order.canceled === '未取消' && order.status === '訂票成功' && (
                      <button onClick={() => handleCancelOrder(order.id)}>取消訂單</button>
                    )}
                    {/* {order.status === '已取消' && (
                      <button onClick={() => handleDeleteChange(order.id)}>刪除訂單</button>
                    )} */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}


