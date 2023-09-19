import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface OrderData {
  price: number;
  quantity: number;
  payment: string;
}

function BookingSample() {
//   const initialOrderData: OrderData = {
//     price: 0,
//     quantity: 0,
//     payment: '',
//   };

//   const [orderData, setOrderData] = useState<OrderData>(initialOrderData);

//   const { user_id } = useParams();
//   console.log("user_id:", user_id);
//   //const [movie, setMovie] = useState<Movie>();
//   useEffect(() => {
//     if (user_id) {
//       const userId = parseInt(user_id);  // Convert 'id' from string to number
//       (async () => {
//         try {
//           const orderData = await postOrder();
//           setMovie(movieData);
//         } catch (error) {
//           console.log(error);
//         }
//       })();
//     }
//   }, [id]);
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     try {
//       // 向后端发送POST请求来创建订单
//       const response = await axios.post('/api/users/{user_id}/orders', orderData);
//       if (response.status === 200) {
//         alert('订单创建成功');
//       } else {
//         alert('订单创建失败');
//       }
//     } catch (error) {
//       console.error('错误:', error);
//       alert('发生错误，请稍后重试');
//     }
//   };

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setOrderData({
//       ...orderData,
//       [name]: value,
//     });
//   };

//   return (
//     <div>
//       <h1>创建订单</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>价格:</label>
//           <input
//             type="number"
//             name="price"
//             value={orderData.price}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>数量:</label>
//           <input
//             type="number"
//             name="quantity"
//             value={orderData.quantity}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>支付方式:</label>
//           <input
//             type="text"
//             name="payment"
//             value={orderData.payment}
//             onChange={handleChange}
//           />
//         </div>
//         <button type="submit">提交订单</button>
//       </form>
//     </div>
//   );
}

export default BookingSample;
