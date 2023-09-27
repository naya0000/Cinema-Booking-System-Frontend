import Navbar from "./components/navbar";
import { Outlet, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AccessDenied from "./pages/AccessDenied";
import UserLogin from "@/pages/UserLogin";
import UserSignUp from "./pages/UserSignUp";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Logout from "./components/Logout";
import { useEffect, useState } from "react";
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
import AdminOrder from "./pages/AdminOrder";
import AdminUser from "./pages/AdminUser";
import UserEditPassword from "./pages/UserEditPassword";
import AdminLogin from "./pages/AdminLogin";


export default function App() {
  // console.log(sessionStorage.getItem('token'));
  const user_id = sessionStorage.getItem('user_id') || '';
  const username = sessionStorage.getItem('username') || '';
  const token = sessionStorage.getItem('token'); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     setIsAuthenticated(!!token);
  //     //console.log("Authenticated(app): ", isAuthenticated);
  //   })();
  // });
  //const isAuthenticated = !!sessionStorage.getItem('token');
 

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Movie/Detail" element={<MovieDetail />} /> {/*http://localhost:3000/cinemas/Movie/detail?id=1*/}
        <Route path="/Member" element={<ProtectedRoute component={MemberPage} requiredRole={['ROLE_USER']} username={username} />} />
        <Route path="/Member/OrderHistory" element={<ProtectedRoute component={OrderHistory} requiredRole={['ROLE_USER']} username={username} />} />
        <Route path="/Order/Cancel/:orderId" element={<ProtectedRoute component={OrderCancel} requiredRole={['ROLE_USER']} username={username} />} />
        <Route path="/Member/Login" element={<UserLogin />} />
        <Route path="/Member/Edit" element={<ProtectedRoute component={UserEdit} requiredRole={['ROLE_USER']} username={username} />} />
        <Route path="/Member/Password" element={<ProtectedRoute component={UserEditPassword} requiredRole={['ROLE_USER']} username={username} />} />
        <Route path="/Member/Signup" element={<UserSignUp />} />
        <Route path="/Accessdenied" element={<AccessDenied />} />
        <Route path="/Booking" element={<ProtectedRoute component={MovieListPage} requiredRole={['ROLE_USER']} username={username} />} />
        <Route path="/Booking/id=:movie_id" element={<ProtectedRoute component={BookingDetail} requiredRole={['ROLE_USER']} username={username} />} />
        <Route path="/Booking/confirm" element={<ProtectedRoute component={OrderDetail} requiredRole={['ROLE_USER']} username={username} />} />
        <Route path="/Admin/Login" element={<AdminLogin />} />
        {/* <Route path="/Admin/Dashboard" element={<ProtectedRoute component={AdminDashboard} requiredRole={['ROLE_ADMIN']} username={username} />} /> */}
        <Route path="/Admin/Users" element={<ProtectedRoute component={AdminUser} requiredRole={['ROLE_ADMIN']} username={username} />} />
        <Route path="/Admin/Orders" element={<ProtectedRoute component={AdminOrder} requiredRole={['ROLE_ADMIN']} username={username} />} />
        <Route path="/Admin/Movies" element={<ProtectedRoute component={AdminMovie} requiredRole={['ROLE_ADMIN']} username={username} />} />
        <Route path="/Admin/Sessions" element={<ProtectedRoute component={AddSessionPage} requiredRole={['ROLE_ADMIN']} username={username} />} />
        <Route path="/Admin/Seats" element={<ProtectedRoute component={AddSeatPage} requiredRole={['ROLE_ADMIN']} username={username} />} />
        <Route path="Logout" element={<Logout />} />
        {/* <Route
          path="/add-session"
          element={<AddSessionPage  />}
        /> */}
        {/* <Route path="/booking/id=:user_id" element={<BookingDetail />} /> */}
        {/* <Route path="/account" element={<ProtectedRoute component={Account} requiredRole={'ROLE_USER'} username={username} />} /> */}
        {/* <Route
          path="/Member/Logout"
          element={<ProtectedRoute component={Logout} requiredRole={'ROLE_USER'} username={username} />}
        /> */}
      </Routes>
    </div>
  );
}

