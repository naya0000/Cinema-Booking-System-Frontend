import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import AccessDenied from '@/pages/AccessDenied'
import { log } from 'console';
import axios from 'axios';
import { useEffect, useState } from 'react';



interface Props {
  component: React.ComponentType;
  requiredRole: string; // Add requiredRoles as an array of strings
  username: string;
}
interface Role {
  id: number;
  name: string;
}
export const ProtectedRoute: React.FC<Props> = ({ component: RouteComponent, requiredRole, username, ...rest}) => {
  const token = sessionStorage.getItem('token');
  console.log("token:",token);
  const [isAuthenticated,setIsAuthenticated]=useState(!!token);
  const [roles, setRoles] = useState<Role[]>([]);
  console.log(isAuthenticated);
  //const [loading, setLoading] = useState(true);
  const api = 'http://localhost:8080';
  console.log(isAuthenticated);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const response = await axios.get(`${api}/users/${username}/roles`);
        console.log("response:", response);
        setRoles(response.data);
        //setLoading(false);
      } catch (error) {
        console.error('Error fetching user roles:', error);
        //setLoading(false);
      }
    };
    fetchUserRoles();
  }, [username]);

  useEffect(()=>{
    setIsAuthenticated(!!token);
  },[token]);

  const userHasRequiredRole = roles.some((role) => role.name === requiredRole);
  console.log("roles: ", roles);
  console.log(isAuthenticated);

  if (isAuthenticated) { //authenticated by the token
    if (userHasRequiredRole) { //is authorized
      return <RouteComponent {...rest} />; 
    } else {
      return <AccessDenied />;
    }
  } else {
    alert("請先登入\nPlease Login first");
    return <Navigate to="/Member/Login" /> //back to home page
  }
}
export default ProtectedRoute;