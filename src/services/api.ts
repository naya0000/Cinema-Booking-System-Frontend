import axios from 'axios';

const BASE_URL = 'http://localhost:8080'; // Replace with your API URL


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
  movieId: number|undefined;
}
interface SeatCreate {
  row:string;
  seatNumber: string[];
  isAvailable: number;
  movieId: number;
  sessionId:number;
}
// Example function to fetch a list of movies
export const fetchMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movies`);
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
export const fetchUserByUsername = async (username: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${username}`);
    if (response.status === 200) {
      console.log("Get user by username successful");
      return response.data; // Assuming your API returns data in JSON format
    }
  } catch (error) {
    throw error; // Handle error appropriately in your components
  }
};
export const fetchSeatsByIds = async (ids: number[]) => {
  
  try {
    const queryParams = ids.map(id => `ids=${id}`).join('&');
    const response = await axios.get(`${BASE_URL}/seats/by-ids?${queryParams}`);
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
export const fetchMovieByQuery = async (query:string ) => {
  
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
export const fetchSessionTimeById = async (id: number) => {
  
  try {
    const response = await axios.get(`${BASE_URL}/sessions/time/${id}`);
    if (response.status === 200) {
      console.log("Get session date and time by ID successful");
      return response.data; // Assuming your API returns data in JSON format
    }
  } catch (error) {
    throw error; // Handle error appropriately in your components
  }
};
export const fetchOrderByUserId = async (user_id: number) => {
  
  try {
    const response = await axios.get(`${BASE_URL}/users/${user_id}/orders`);
    if (response.status === 200) {
      console.log("Get orders by User ID successful");
      return response.data; // Assuming your API returns data in JSON format
    }
  } catch (error) {
    throw error; // Handle error appropriately in your components
  }
};
export const updateOrderStatus = async (order_id: number, canceledStatus: string) => {
  
  try {
    const response = await axios.put(
      `${BASE_URL}/orders/status/${order_id}`,
        `"${canceledStatus}"`
      ,{
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response);
    console.log("Order cancel !");
    return response.status;
    // Redirect or navigate to a success page here
  } catch (error) {
    console.log(error);
  }
};
export const createOrder = async (userId:number, requestData:OrderData) => {
  try { 
    const response = await axios.post(
      `${BASE_URL}/users/${userId}/orders`,
      requestData
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
export const createMovie = async (requestData:Movie) => {
  try { 
    const response = await axios.post(
      `${BASE_URL}/movies`,
      requestData
    );
    //console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const createMovieSession = async (requestData:Session) => {
  try { 
    const response = await axios.post(
      `${BASE_URL}/sessions`,
      requestData
    );
    //console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
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
  }
};
export const fetchMovieSeats = async (movieId: number,sessionId: number) => {
  try { 
    const response = await axios.get(
      `${BASE_URL}/seats/search?movie=${movieId}&session=${sessionId}`
    );
    //console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const createMovieSeats = async (requestData:SeatCreate) => {
  try { 
    const response = await axios.post(
      `${BASE_URL}/seats`,
      requestData
    );
    //console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
// /fetchSessions
// Add more API functions for booking, payments, etc.
