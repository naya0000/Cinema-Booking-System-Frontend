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
import { grey, red } from '@mui/material/colors';

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
  seatRow: string;
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
  // Inside your component
  const [isChecked, setIsChecked] = useState(false);
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
    const canceled = '未取消';
    const status = '訂票成功';
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
  };
  const check = anOrderData.payment && isChecked;
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return (
    <Container>
      <Typography variant="h6" gutterBottom marginTop={7} >
        *請確認所選擇之電影、日期、場次是否正確
      </Typography>

      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h6" gutterBottom>
          訂票明細 Booking Details
        </Typography>
        <form onSubmit={handleSubmit}  >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: '1.2rem' }}>電影</TableCell>
                  <TableCell style={{ fontSize: '1.2rem' }}>日期</TableCell>
                  <TableCell style={{ fontSize: '1.2rem' }}>場次</TableCell>
                  <TableCell style={{ fontSize: '1.2rem' }}>票種</TableCell>
                  <TableCell style={{ fontSize: '1.2rem' }}>座位</TableCell>
                  <TableCell style={{ fontSize: '1.2rem' }}>手續費</TableCell>
                  <TableCell style={{ fontSize: '1.2rem' }}>購票總價</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ fontSize: '1rem' }}>{movieTitle}</TableCell>
                  <TableCell style={{ fontSize: '1rem' }}>{showTime[1]}</TableCell>
                  <TableCell style={{ fontSize: '1rem' }}>{showTime[0]}</TableCell>
                  <TableCell style={{ fontSize: '1rem' }}>
                    {anOrderData?.ticket}
                    <Typography style={{ fontSize: '1rem' }}>
                      {anOrderData?.ticket === "全票" ? "$100" : "$90"}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ fontSize: '1rem' }}>
                    {seats.map((seat) => `${seat.seatRow}${seat.seatNumber}`).join(', ')}
                  </TableCell>
                  <TableCell style={{ fontSize: '1rem' }}>${20 * anOrderData.quantity}</TableCell>
                  <TableCell style={{ fontSize: '1rem' }} >
                    {/* <Typography > */}
                    {anOrderData?.ticket === "全票" ? "$100" : "$90"} * {anOrderData.quantity} + $20 * {anOrderData.quantity}=
                    ${anOrderData?.totalAmount}
                    {/* </Typography> */}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <PaymentSelect
            onChange={(payment) => setAnOrderData({ ...anOrderData!, payment })}
          />
          <div style={{ margin: '20px 0' }}>
            <label>
              <input type="checkbox" onChange={handleCheckboxChange} />
              我已經閱讀並同意線上訂票須知及電影分級制度說明
            </label>
          </div>
          <Button type="submit" variant="contained" color="primary" style={{ marginLeft: '10px' }} disabled={!check}>
            Submit Payment
          </Button>
        </form>
      </Paper>



    </Container>
  );
};

