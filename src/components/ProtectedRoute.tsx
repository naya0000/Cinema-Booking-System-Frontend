import { useSelector } from 'react-redux'
import jwt_decode from "jwt-decode";
import { Navigate } from 'react-router-dom'
import AccessDenied from '@/pages/AccessDenied'
import { log } from 'console';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ElevatorSharp } from '@mui/icons-material';

interface Props {
  component: React.ComponentType;
  requiredRole: string[]; // Add requiredRoles as an array of strings
  username: string;
}

export const ProtectedRoute: React.FC<Props> = ({ component: RouteComponent, requiredRole, username, ...rest}) => {
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('roles');
  console.log("role:",role);
  const [isAuthenticated,setIsAuthenticated]=useState(!!token);
  //const [roles, setRoles] = useState([]);
  //console.log(isAuthenticated);
  //const [loading, setLoading] = useState(true);
  const api = 'http://localhost:8080';
  //console.log(isAuthenticated);
  //const decodedToken: {username:string, sub: string, iss: number, exp: number,roles:string[]} = jwt_decode(token||'');

  //setRoles(decodedToken.sub);
  //console.log("decodedToken.sub:",decodedToken.roles[0]);
  // useEffect(() => {
  //   const fetchUserRoles = async () => {
  //     if(username==''){
  //       return 
  //     }
  //     try {
  //       const response = await axios.get(`${api}/users/${username}/roles` , {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`
  //         },
  //       });
  //       console.log("response:", response);
  //       setRoles(response.data);
  //       //setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching user roles:', error);
  //       //setLoading(false);
  //     }
  //   };
  //   fetchUserRoles();
  // }, [username]);

  useEffect(()=>{
    setIsAuthenticated(!!token);
  },[token]);

  // const userHasRequiredRole = role.some((role) => requiredRole.includes( role.name));
  // console.log("roles: ", userHasRequiredRole);
  // console.log(isAuthenticated);

  if (isAuthenticated) { //authenticated by the token
    if (role===requiredRole[0]) { //has authorication
      return <RouteComponent {...rest} />; 
    } else {
      return <AccessDenied />;
    }
  } else {
    alert(`請先登入\nPlease Login first\n即將導向: ${requiredRole[0]==='ROLE_USER'?'用戶':'管理員'}登入頁面`);
    if(requiredRole[0]==='ROLE_USER'){
      return <Navigate to="/Member/Login" /> //back to home page
    }else{
      return <Navigate to="/Admin/Login" /> //back to home page
    }
    
  }
}
export default ProtectedRoute;


