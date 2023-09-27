import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@mui/material';
import { fetchMovieTitleById, fetchOrderByUserId, fetchSeatsByIds, fetchSessionTimeById } from '@/services/api';
import PaymentSelect from '@/components/PaymentSelect';
import { log } from 'console';
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
  seatsNumber: string[];
  seatsRow: string[];
  totalAmount: number;
  canceled: string;
  status: string;
}

export default function OrderDetail() {
  const api = 'http://localhost:8080';
  const user_id = sessionStorage.getItem('user_id') || '';
  const token = sessionStorage.getItem('token') || '';
  const [ordersData, setOrdersData] = useState<Order[]>([]);
  const navigate = useNavigate();
  const userId = parseInt(user_id);

  useEffect(() => { //get orders by userID
    if (userId) {
      (async () => {
        try {
          const data = await fetchOrderByUserId(userId);
          setOrdersData(data);
          console.log("ordersData:", data);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [userId, token]);

  const handleCancelOrder = (orderId: number, order: Order) => {
    navigate(`/Order/Cancel/${orderId}`, { state: { orderData: order } });
  }



  return (
    <Container>
      <Typography variant="h6" gutterBottom marginTop={5}>
        訂票明細
      </Typography>

      <Paper elevation={3} style={{ padding: '20px', width: '100%' }}>
        <TableContainer>
          <Table>
            <TableHead >
              <TableRow >
                <TableCell >訂票序號</TableCell>
                <TableCell>片名</TableCell>
                <TableCell>訂購日期</TableCell>
                <TableCell>付款方式</TableCell>
                <TableCell>數量</TableCell>
                <TableCell>座位</TableCell>
                <TableCell>場次日期</TableCell>
                <TableCell>場次時間</TableCell>
                <TableCell>票種</TableCell>
                <TableCell>總金額</TableCell>
                <TableCell>狀態</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordersData.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.movie}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.payment}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  {/* <TableCell>{order.seatsNumber.join(', ')}</TableCell>
                  <TableCell>{order.seatsRow.join(', ')}</TableCell> */}
                  <TableCell>
                    {order.seatsNumber.map((number, index) => {
                      const row = order.seatsRow[index]; // Get the corresponding row
                      return `${row}${number}`;
                    }).join(', ')}
                  </TableCell>
                  <TableCell>{order.sessionDate}</TableCell>
                  <TableCell>{order.startTime}</TableCell>
                  <TableCell>{order.ticket}</TableCell>
                  <TableCell>{order.totalAmount}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    {order.status === '已取消'
                      ? ''
                      : order.canceled === '使用者' && order.status === '處理中'
                        ? '已申請取消訂單'
                        : <button onClick={() => handleCancelOrder(order.id, order)}>取消訂單</button>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  )
};

