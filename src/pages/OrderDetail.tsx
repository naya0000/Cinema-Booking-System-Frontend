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
import { createOrder, fetchMovieTitleById, fetchSeatsByIds, fetchSessionTimeById } from '@/services/api';
import PaymentSelect from '@/components/PaymentSelect';
import { log } from 'console';
import axios from 'axios';

interface OrderData {
  //price: number;
  orderDate: string;
  quantity: number;
  payment: string;
  ticket: string;
  movie: {
    id: number
  };
  session: {
    id: number
  };
  user: {
    id: number
  };
  seatsId: number[];
  totalAmount: number;
  canceled: string;
}
interface Seat {
  id: number;
  seatRow:string;
  seatNumber: string;
  isAvailable: number;
}

export default function OrderDetail() {
  const api = 'http://localhost:8080';
  const navigate = useNavigate();
  const location = useLocation();
  const { orderData } = location.state as { orderData: OrderData };
  const [anOrderData, setAnOrderData] = useState(orderData);
  console.log("initialBookingData:", anOrderData);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [showTime, setShowTime] = useState("");

  useEffect(() => { //get seats data
    if (anOrderData.seatsId) {
      (async () => {
        try {
          const seatsData = await fetchSeatsByIds(anOrderData.seatsId);
          setSeats(seatsData);
          console.log("seatsData:", seatsData);
        } catch (error) {
          console.log(error);
        }
      })();;
    }
  }, [anOrderData.seatsId]);
  useEffect(() => { //get movie title by movieId
    if (anOrderData.movie.id) {
      (async () => {
        try {
          const titleData = await fetchMovieTitleById(anOrderData.movie.id);
          setMovieTitle(titleData);
          console.log("titleData:", titleData);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [anOrderData.movie.id]);
  useEffect(() => { //get movie title by movieId
    if (anOrderData.session.id) {
      (async () => {
        try {
          const timeData = await fetchSessionTimeById(anOrderData.session.id);
          setShowTime(timeData[0]);
          console.log("timeData:", timeData);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [anOrderData.session.id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const now = new Date();
    const userId = parseInt(sessionStorage.getItem('user_id') || '');
    const orderDate = now.toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
    const canceled = 'N';
    const status = '處理中';
    //setAnOrderData({...anOrderData,orderDate})
    const requestData = { ...anOrderData, orderDate, canceled, status };

    console.log("requestData:", requestData);
    // create a new order
    (async () => {
      try {
        const response = await createOrder(userId, requestData);
        console.log(response);
        console.log("Form Submitted!");
        alert('訂票成功');
        navigate('/');
      } catch (error) {
        console.log(error);
      }
    })();

    // try {
    //   const response = await axios.post(
    //     `${api}/users/${userId}/orders`,
    //     requestData
    //   );
    //   console.log(response);
    //   console.log("Form Submitted!");
    //   alert('訂票成功');
    //   navigate('/');
    //   // Redirect or navigate to a success page here
    // } catch (error) {
    //   console.log(error);
    // }
  };


  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        *請確認所選擇之電影、日期、場次是否正確
      </Typography>

      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h6" gutterBottom>
          訂票明細 Booking Details
        </Typography>
        <form onSubmit={handleSubmit}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>電影</TableCell>
                  <TableCell>日期</TableCell>
                  <TableCell>場次</TableCell>
                  <TableCell>票種</TableCell>
                  <TableCell>座位</TableCell>
                  <TableCell>手續費</TableCell>
                  <TableCell>購票總價</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{movieTitle}</TableCell>
                  <TableCell>{showTime[1]}</TableCell>
                  <TableCell>{showTime[0]}</TableCell>
                  <TableCell>
                    {anOrderData?.ticket === "Regular_Ticket" ? "全票" : "優待票"}
                    <Typography >
                      {anOrderData?.ticket === "Regular_Ticket" ? "$100" : "$90"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {seats.map((seat) =>`${seat.seatRow}${seat.seatNumber}`).join(', ')}
                  </TableCell>
                  <TableCell>${20 * anOrderData.quantity}</TableCell>
                  <TableCell >
                    {/* <Typography > */}
                    {anOrderData?.ticket === "Regular_Ticket" ? "$100" : "$90"} * {anOrderData.quantity} + $20 * {anOrderData.quantity}=
                    ${anOrderData?.totalAmount}
                    {/* </Typography> */}
                  </TableCell>
                  {/* <TableCell>{anOrderData?.price}</TableCell> */}
                  {/* <TableCell>
                  ${orderDetails?.price * orderDetails?.quantity}
                </TableCell> */}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <PaymentSelect
            onChange={(payment) => setAnOrderData({ ...anOrderData!, payment })}
          />
          <Button type="submit" variant="contained" color="primary">
            Submit Payment
          </Button>
        </form>
      </Paper>
      <h5>
        我已經閱讀並同意線上訂票須知及電影分級制度說明
      </h5>
    </Container>
  );
};

