import { useContext, useEffect, useState } from "react";
import productsData from "@/assets/productsData";
import { log } from "console";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { fetchMovies } from "@/services/api";
import { Link, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
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
    totalAmount: number;
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
    releaseDate: string;
    status: string;
    genre: string;
    level: string;
    coverUrl: string;
}
const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength) + "...";
};
export default function MovieListPage() {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const movieData = await fetchMovies();
                setMovies(movieData);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    return (
        <Container style={{ maxWidth: "1600px", marginTop: 30 }}>
            <Typography variant="h6" component="h1" marginBottom={3}>
                請選擇電影名稱:
            </Typography>
            {movies
                .filter((movie) => movie.status === 'RELEASED')
                .map((movie) => (
                    <Box
                        key={movie.id}
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        flexDirection="row"
                        marginBottom={4} // Add margin between each movie
                    >
                        <a href={`/cinemas/Booking/id=${movie.id}`} style={{ textDecoration: "none" }}>
                            <Box flex="1" marginRight={4}>
                                <img
                                    src={movie.coverUrl}
                                    alt={movie.title}
                                    style={{
                                        width: "200px",
                                        height: "auto",
                                    }}
                                />
                            </Box>
                        </a>
                        <Box flex="1.5" marginRight={4}>
                            <a href={`/cinemas/Booking/id=${movie.id}`} style={{ textDecoration: "none" }}>
                                <Typography variant="h5" component="h1">
                                    {movie.title}
                                </Typography>
                            </a>
                            <Typography variant="body2" color="textSecondary">
                                上映日期: {movie.releaseDate}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                類型: {movie.genre}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {movie.level}
                            </Typography>
                        </Box>
                        <Box flex="2.5">
                            <Typography variant="h6" component="h2">
                                電影介紹
                            </Typography>
                            <Typography variant="body1" color="textPrimary" style={{ maxHeight: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {truncateText(movie.description, 250)} {/* Adjust the maximum length */}
                            </Typography>
                        </Box>
                    </Box>
                ))}
        </Container>
    )
}