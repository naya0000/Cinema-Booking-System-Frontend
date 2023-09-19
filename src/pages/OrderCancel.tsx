import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { updateOrderStatus } from '@/services/api';
const containerStyle = {
  marginBottom: '20px', // Add margin at the bottom of the TableContainer
};

const pStyle = {
  marginTop: '20px', // Add margin at the top of the <p> element
};
interface Order {
  id: number;
  orderDate: string;
  quantity: number;
  payment: string;
  ticket: string;
  movie: string;
  startTime: string;
  sessionDate: string;
  user: number;
  seatsNumber: string[];
  totalAmount: number;
  canceled: string;
}
export default function OrderCancel() {
  const api = 'http://localhost:8080';
  const location = useLocation();
  const { orderData } = location.state as { orderData: Order };
  const [anOrderData, setAnOrderData] = useState(orderData);
  const navigate = useNavigate();
  console.log("initialBookingData:", anOrderData);

  const handleCancel = async() => {
    // console.log("orderid:",orderId);
    ///orders/status/{id}
    setAnOrderData({ ...anOrderData, canceled: 'Y' });
    
    try {
      const response = await updateOrderStatus(anOrderData.id,'Y');
      if (response=== 200) {
        alert('取消訂單成功');
        navigate('/Member/OrderHistory');
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
       <Typography variant="h6">Order Details</Typography>
      <TableContainer component={Paper} style={containerStyle}>
        <Table>
          <TableHead>
            {/* <TableRow>
              <TableCell>Field</TableCell>
              <TableCell>Value</TableCell>
            </TableRow> */}
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell><strong>Order ID:</strong></TableCell>
              <TableCell>{anOrderData.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Order Date:</strong></TableCell>
              <TableCell>{anOrderData.orderDate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Quantity:</strong></TableCell>
              <TableCell>{anOrderData.quantity}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Payment Method:</strong></TableCell>
              <TableCell>{anOrderData.payment}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Ticket Type:</strong></TableCell>
              <TableCell>{anOrderData.ticket}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Movie:</strong></TableCell>
              <TableCell>{anOrderData.movie}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Start Time:</strong></TableCell>
              <TableCell>{anOrderData.startTime}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Session Date:</strong></TableCell>
              <TableCell>{anOrderData.sessionDate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>User ID:</strong></TableCell>
              <TableCell>{anOrderData.user}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Seats:</strong></TableCell>
              <TableCell>{anOrderData.seatsNumber.join(', ')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Total Amount:</strong></TableCell>
              <TableCell>{anOrderData.totalAmount}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {/* Display a confirmation message */}
      <Typography variant="h6" style={pStyle}>
        Are you sure you want to cancel this order?
      </Typography>
      <Button variant="contained" color="primary" style={{marginRight: '20px'}} onClick={() => handleCancel()}>
        Confirm Cancellation
      </Button>
      <Button variant="contained" color="primary">Cancel</Button>
    </div>
  );
}


