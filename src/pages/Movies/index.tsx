import { useContext, useEffect, useState } from "react";
import productsData from "@/assets/productsData";
import { log } from "console";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { fetchMovies } from "@/services/api";
import { Link } from "react-router-dom";
interface Seat {
    id: number;
    seatNumber: string;
    isAvailable: boolean;
}
interface CustomerOrder {
    id: number;
    price: number;
    orderDate: Date;
    quantity: number;
    payment: string;
}
interface Session {
    id: number;
    startTime: Date;
    endTime: Date;
    sessionDate: Date;
    orders: CustomerOrder[];

}
interface Movie {
    id: number;
    title: string;
    description: string;
    releaseDate: String;
    seats: Seat[];
    sessions: Session[];
    orders: CustomerOrder[];
}
export default function Movies() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const api = 'http://localhost:8080';
    const token = sessionStorage.getItem('token');
    // console.log(token);
    useEffect(() => {
        (async () => {
            try {
              const movieData = await fetchMovies();
              setMovies(movieData);
                // const response = await axios.get<Movie[]>(
                //     `${api}/movies`, {
                //     headers: {
                //         Authorization: `Bearer ${token}`
                //     }
                // });
                // if (response.status === 200) {
                //     console.log("Get movies successfull");
                //     setMovieList(response.data);
                    //seatsData =  moviesData.seats;
                    //   movies.map((movie: any)=>{
                    //     console.log(movie);
                    //   })
                    //alert(response.data);
                // }
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    return (<div>
      <h1>Movie List</h1>
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>
                <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
              <h2>{movie.title}</h2>
              {/* <p>{movie.description}</p> */}
              <p>Release Date: {movie.releaseDate}</p>
              {/* Add more movie information as needed */}
            </li>
          ))}
        </ul>
    </div>)
}