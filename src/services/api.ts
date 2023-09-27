import axios, { AxiosError, AxiosResponse } from 'axios';


interface OrderData {
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
  status: string;
}
interface User {
  name: string;
  password: string;
  username: string;
  phoneNumber: string;
}
interface Movie {
  title: string;
  description: string;
  releaseDate: string;
  status: string;
  genre: string;
  level: string;
  coverUrl: string;
}
interface Session {
  startTime: string;
  endTime: string;
  sessionDate: string;
  movieId: number | undefined;
}
interface SeatCreate {
  row: string;
  seatNumber: string[];
  isAvailable: number;
  movieId: number;
  sessionId: number;
}
const token = sessionStorage.getItem('token');

const BASE_URL = 'http://localhost:8080';

// Example function to fetch a list of movies
export const fetchMovies = async () => {
  //console.log("token:",token);
  try {
    const response = await axios.get(`${BASE_URL}/movies`,
      // {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // }
    );
    if (response.status === 200) {
      console.log("Get movies successfull");
      return response.data; // Assuming your API returns data in JSON format
    }
  } catch (error) {
    throw error; // Handle error appropriately in your components
  }
};
export const fetchMovieById = async (id: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/movies/${id}`);
    if (response.status === 200) {
      console.log("Get movie by ID successful");
      return response.data; // Assuming your API returns data in JSON format
    }
  } catch (error) {
    throw error; // Handle error appropriately in your components
  }
};
// export const createUser = async (requestData: User): Promise<AxiosResponse>  => {
//   try { 
//     const response: AxiosResponse = await axios.post(
//       `${BASE_URL}/users`,
//       requestData
//     );
//     return response;
//     //console.log(response);
//   } 
//   catch (error) {
//     //console.log(error);
//     const axiosError = error as AxiosError;
//     console.log(axiosError);
//     throw axiosError; // Rethrow the error
//   }
// };
export const fetchUserByUsername = async (username: string) => { 
  try {
    const response = await axios.get(`${BASE_URL}/users/${username}`, //AUTH
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    if (response.status === 200) {
      console.log("Get user by username successful");
      return response.data; // Assuming your API returns data in JSON format
    }
  } catch (error) {
    throw error; // Handle error appropriately in your components
  }
};
export const fetchAllUsers = async () => { //ADMIN
  try {
    const response = await axios.get(`${BASE_URL}/users`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    if (response.status === 200) {
      console.log("Get all users successful");
      return response.data; // Assuming your API returns data in JSON format
    }
  } catch (error) {
    throw error; // Handle error appropriately in your components
  }
};
export const fetchSeatsByIds = async (ids: number[]) => { //authenticated

  try {
    const queryParams = ids.map(id => `ids=${id}`).join('&');
    const response = await axios.get(`${BASE_URL}/seats/by-ids?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    if (response.status === 200) {
      console.log("Get seats by IDs successful");
      return response.data; // Assuming your API returns data in JSON format
    }
  } catch (error) {
    throw error; // Handle error appropriately in your components
  }
};
export const fetchMovieTitleById = async (id: number) => {

  try {
    const response = await axios.get(`${BASE_URL}/movies/title/${id}`);
    if (response.status === 200) {
      console.log("Get movie title by ID successful");
      return response.data; // Assuming your API returns data in JSON format
    }
  } catch (error) {
    throw error; // Handle error appropriately in your components
  }
};
export const fetchMovieByQuery = async (query: string) => {

  try {
    const response = await axios.get(`${BASE_URL}/movies/search?query=${query}`);
    if (response.status === 200) {
      console.log("Search movie by query successful");
      return response.data; // Assuming your API returns data in JSON format
    }
  } catch (error) {
    throw error; // Handle error appropriately in your components
  }
};
export const fetchSessionTimeById = async (id: number) => { //authenticated

  try {
    const response = await axios.get(`${BASE_URL}/sessions/time/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    if (response.status === 200) {
      console.log("Get session date and time by ID successful");
      return response.data; // Assuming your API returns data in JSON format
    }
  } catch (error) {
    throw error; // Handle error appropriately in your components
  }
};
export const fetchAllOrders = async () => { //ADMIN
  try {
    const response = await axios.get(`${BASE_URL}/orders`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    if (response.status === 200) {
      console.log("Get all orders successful");
      return response.data; // Assuming your API returns data in JSON format
    }
  } catch (error) {
    throw error; // Handle error appropriately in your components
  }
};
export const fetchOrderByUserId = async (user_id: number) => { //Authenticed

  try {
    const response = await axios.get(`${BASE_URL}/users/${user_id}/orders`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    if (response.status === 200) {
      console.log("Get orders by User ID successful");
      return response.data; // Assuming your API returns data in JSON format
    }
  } catch (error) {
    throw error; // Handle error appropriately in your components
  }
};
export const updateCanceledStatus = async (order_id: number, canceledStatus: string) => { 

  try {
    const response = await axios.put(
      `${BASE_URL}/orders/canceledStatus/${order_id}`, //Authenticated
      `"${canceledStatus}"`
      , {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }
    );
    console.log(response);
    console.log("User cancel order");
    return response.status;
    // Redirect or navigate to a success page here
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const updateOrderStatus = async (order_id: number, orderStatus: string) => { 

  try {
    const response = await axios.put(
      `${BASE_URL}/orders/status/${order_id}`, //ADMIN 
      `"${orderStatus}"`
      , {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }
    );
    console.log(response);
    console.log("Admin cancel order!");
    return response.status;
    // Redirect or navigate to a success page here
  } catch (error) {
    //console.log(error);
    throw error;
  }
};
export const updateUserStatus = async (user_id: number, locked: boolean) => { 

  try {
    const response = await axios.put( //ADMIN
      `${BASE_URL}/users/status`,
      {
        id: user_id,
        locked: locked,
      }
      , {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }
    );
    // console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createOrder = async (userId: number, requestData: OrderData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/users/${userId}/orders`,  //Authenticated
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log(response);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const createMovie = async (requestData: Movie) => { //ADMIN
  try {
    const response = await axios.post(
      `${BASE_URL}/movies`,
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    //console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const updateMovie = async (movieId: number, requestData: Movie) => { //ADMIN
  try {
    const response = await axios.put(
      `${BASE_URL}/movies/${movieId}`,
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const deleteMovie = async (movieId: number) => { //ADMIN
  try {
    const response = await axios.delete(
      `${BASE_URL}/movies/${movieId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const createMovieSession = async (requestData: Session) => { //ADMIN
  try {
    const response = await axios.post(
      `${BASE_URL}/sessions`,
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    if (response.status === 201) {
      console.log("create session successful");
      return response.data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const fetchMovieSessions = async (movie: number) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/sessions/search?movie=${movie}`
    );
    //console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const fetchMovieSeats = async (movieId: number, sessionId: number) => {
  try {
    //console.log("movieId:",movieId,"sessionId:",sessionId);
    const response = await axios.get( //auth
      `${BASE_URL}/seats/search?movie=${movieId}&session=${sessionId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log("seatsResponse:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

