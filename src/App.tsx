import Navbar from "./components/navbar";
import { Outlet, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AccessDenied from "./pages/AccessDenied";
import UserLogin from "@/pages/UserLogin";
import UserSignUp from "./pages/UserSignUp";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Logout from "./components/Logout";
import { useEffect, useState } from "react";
import Movies from "./pages/Movies";
import MovieListPage from "./pages/MovieListPage";
import { MovieRounded } from "@mui/icons-material";
import BookingDetail from "./pages/BookingDetail";
import OrderDetail from "./pages/OrderDetail";
import MovieDetail from "./pages/MovieDetail";
import HomePage from "@/pages/HomePage";
import MemberPage from "./pages/MemberPage";
import OrderHistory from "./pages/OrderHistory";
import OrderCancel from "./pages/OrderCancel";
import UserEdit from "./pages/UserEdit";
import AdminMovieManagement from "./pages/AdminMovie";
import AddSessionPage from "./pages/AddSessionPage";
import AdminMovie from "./pages/AdminMovie";
import AddSeatPage from "./pages/AddSeatPage";


function App() {
  // console.log(sessionStorage.getItem('token'));
  const user_id = sessionStorage.getItem('user_id') || '';
  const username = sessionStorage.getItem('username') || '';
  const token = sessionStorage.getItem('token');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      setIsAuthenticated(!!token);
      console.log("Authenticated(app): ", isAuthenticated);
    })();
  });
  //const isAuthenticated = !!sessionStorage.getItem('token');
  console.log("app");

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Movie/detail" element={<MovieDetail />} />
        <Route path="/Member" element={<MemberPage />} />
        <Route path="/Member/OrderHistory" element={<OrderHistory />} />
        <Route path="/Order/Cancel/:orderId" element={<OrderCancel />} />
        <Route path="/Member/Login" element={<UserLogin />} />
        <Route path="/Member/Edit" element={<UserEdit />} />
        <Route path="/Signup" element={<UserSignUp />} />
        <Route path="/Accessdenied" element={<AccessDenied />} />
        <Route path="/Booking" element={<ProtectedRoute component={MovieListPage} requiredRole={'ROLE_USER'} username={username} />} />
        <Route path="/Booking/id=:movie_id" element={<BookingDetail />} />
        <Route path="/Booking/confirm" element={<OrderDetail />} />
        <Route path="/Admin/Movies" element={<AdminMovie />} />
        <Route path="/Admin/Sessions" element={<AddSessionPage />} />
        <Route path="/Admin/Seats" element={<AddSeatPage />} />
        {/* <Route
          path="/add-session"
          element={<AddSessionPage  />}
        /> */}
        {/* <Route path="/booking/id=:user_id" element={<BookingDetail />} /> */}
        {/* <Route path="/account" element={<ProtectedRoute component={Account} requiredRole={'ROLE_USER'} username={username} />} /> */}
        <Route
          path="/Member/Logout"
          element={<ProtectedRoute component={Logout} requiredRole={'ROLE_USER'} username={username} />}
        />
      </Routes>
    </div>
  );
}

export default App;
