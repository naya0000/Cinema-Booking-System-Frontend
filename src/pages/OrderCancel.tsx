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
import { updateCanceledStatus, updateOrderStatus } from '@/services/api';
const containerStyle = {
  marginBottom: '20px', // Add margin at the bottom of the TableContainer
};

const pStyle = {
  marginTop: '20px', // Add margin at the top of the <p> element
  marginBottom: '20px', 
  marginLeft: '20px', 
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
  seatsRow: string[];
  seatsNumber: string[];
  totalAmount: number;
  canceled: string;
  status: string;
}
export default function OrderCancel() {
  const api = 'http://localhost:8080';
  const location = useLocation();
  const { orderData } = location.state as { orderData: Order };
  const [anOrderData, setAnOrderData] = useState(orderData);
  const navigate = useNavigate();
  console.log("initialBookingData:", anOrderData);
  const seats = anOrderData.seatsRow.forEach((row) => anOrderData.seatsNumber.join(','));
  const handleCancel = async () => {
    // console.log("orderid:",orderId);
    ///orders/status/{id}
    setAnOrderData({ ...anOrderData, canceled: '使用者' });

    try {
      const responseCancel = await updateCanceledStatus(anOrderData.id, '使用者');
      const responseOrder= await updateOrderStatus(anOrderData.id, '處理中');
      if (responseCancel === 200 && responseOrder) {
        alert('取消訂單成功');
        navigate('/Member/OrderHistory');
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <Typography variant="h6" style={{ marginTop: '3rem',marginLeft: '15px' }}>
        訂單明細:
      </Typography>

      <TableContainer component={Paper} style={containerStyle}>
        <Table>
          {/* <TableHead sx={{mt:"6"}}>
          訂單明細
          </TableHead> */}
          <TableBody>
            {/* <TableRow>
              <TableCell><strong>訂票序號:</strong></TableCell>
              <TableCell>{anOrderData.id}</TableCell>
            </TableRow> */}
            <TableRow>
              <TableCell><strong>訂票日期:</strong></TableCell>
              <TableCell>{anOrderData.orderDate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>訂票數量:</strong></TableCell>
              <TableCell>{anOrderData.quantity}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>支付方式:</strong></TableCell>
              <TableCell>{anOrderData.payment}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>票種類型:</strong></TableCell>
              <TableCell>{anOrderData.ticket}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>電影名稱:</strong></TableCell>
              <TableCell>{anOrderData.movie}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>場次:</strong></TableCell>
              <TableCell>{anOrderData.sessionDate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>開始時間:</strong></TableCell>
              <TableCell>{anOrderData.startTime}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>座位:</strong></TableCell>
              <TableCell>
                {anOrderData.seatsRow.map((row, index) => (
                  <span key={index}>
                    {row}
                    {anOrderData.seatsNumber[index]}
                    {index < anOrderData.seatsRow.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </TableCell>
              {/* <TableCell>{anOrderData.seatsRow} {anOrderData.seatsNumber.join(', ')}</TableCell> */}
            </TableRow>
            <TableRow>
              <TableCell><strong>總價格:</strong></TableCell>
              <TableCell>{anOrderData.totalAmount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>訂單狀態:</strong></TableCell>
              <TableCell>{anOrderData.status}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {/* Display a confirmation message */}
      <Typography variant="h6" style={pStyle} >
        確定要取消訂單嗎?
      </Typography>
      <Button variant="contained" color="primary" style={{ marginRight: '20px',marginLeft: '20px',marginBottom: '20px' }} onClick={() => handleCancel()}>
        確認取消
      </Button>
      <Button variant="contained" color="primary" style={{marginBottom: '20px'}}>Cancel</Button>
    </div>
  );
}


