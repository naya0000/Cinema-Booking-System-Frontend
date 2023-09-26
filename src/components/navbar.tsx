import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const pages = ['線上訂票', '會員中心'];
const adminPages = ['訂單管理', '會員管理', '電影管理'];
const settings = ['Login', 'Account', 'Logout', 'Signup'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('roles');
  const username = sessionStorage.getItem('username');
  const name = sessionStorage.getItem('name');
  // Use the useLocation hook to get the current page URL
  const location = useLocation();
  
  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  function renderSwitch(page: string) {
    switch (page) {
      case '線上訂票':
        return "/cinemas/Booking";
      case '會員中心':
        return '/cinemas/Member'; // Replace with the actual route path for Pricing
      case '訂單管理':
        return "/cinemas/Admin/Orders";
      case '電影管理':
        return "/cinemas/Admin/Movies";
      case '會員管理':
        return "/cinemas/Admin/Users";
      default:
        return '/'; // Default route path
    }
  }

  return (
    <React.Fragment>
    <AppBar
      // position="static"
      position="fixed" // Set the position to "fixed"
      sx={{
        backgroundColor:
          role === 'ROLE_ADMIN' || location.pathname === '/Admin/Login' // Check if on Admin/Login page
            ? 'blue'
            : '#f288a8',
        
      }}
      style={{ top: 0 }} // Keep the AppBar at the top
      
    > <Toolbar>
    {/* Set background color to red */}
      <Container maxWidth="xl">
        <Toolbar disableGutters >
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex', color: '#f8b7ca' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/cinemas"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex', color: '#fce2ea' }, // `MIRAMAR` color
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MIRAMAR
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MIRAMAR
          </Typography>

          {/* {role === 'ROLE_ADMIN' ? (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {adminPages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  component="a"
                  href={renderSwitch(page)}
                  sx={{ my: 2, color: '#930059', display: 'inherit' }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  component="a"
                  href={renderSwitch(page)}
                  sx={{ my: 2, color: '#930059', display: 'inherit' }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          )} */}
          {isAuthenticated ? (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {role === 'ROLE_ADMIN' ? (
                adminPages.map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    component="a"
                    href={renderSwitch(page)}
                    sx={{
                      my: 2,
                      color: 'white',
                      display: 'inherit',
                      
                    }}
                  >
                    {page}
                  </Button>
                ))
              ) : (
                pages.map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    component="a"
                    href={renderSwitch(page)}
                    sx={{
                      my: 2,
                      color:
                        location.pathname === '/Admin/Login' // Check if on Admin/Login page
                          ? 'blue'
                          : 'white',
                      display: 'inherit'
                    }}
                  >
                    {page}
                  </Button>
                ))
              )}
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {
                pages.map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    component="a"
                    href={renderSwitch(page)} sx={{
                      my: 2,
                      color:
                        location.pathname === '/Admin/Login' // Check if on Admin/Login page
                          ? 'white'
                          : '#930059',
                      display: 'inherit',
                      
                      
                    }}
                    //sx={{ my: 2, color: '#930059', display: 'inherit' }}
                  >
                    {page}
                  </Button>
                ))
              }
            </Box>
          )}
           {isAuthenticated ? (
          <Typography textAlign="center" marginRight={3}>{name}，歡迎!</Typography>):(
            <Link to="/Member/Signup" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography textAlign="center" marginRight={3}>歡迎加入美麗華影城會員</Typography>
            </Link>
          )}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {isAuthenticated ? (
                [ 
                  role === 'ROLE_ADMIN' ? ([
                    <Link to="/Logout" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <MenuItem>
                        <Typography textAlign="center">登出會員</Typography>
                      </MenuItem>
                    </Link>]
                  ) : ([
                   
                    <Link to="/Member" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <MenuItem>
                        <Typography textAlign="center">會員中心</Typography>
                      </MenuItem>
                    </Link>,
                    <Link to="/Logout" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <MenuItem >
                        <Typography textAlign="center">登出會員</Typography>
                      </MenuItem>
                    </Link>,])
                ] //add key in list
              ) : (
                [
                  <Link to="/Member/Login" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <MenuItem>
                      <Typography textAlign="center">會員登入</Typography>
                    </MenuItem>
                  </Link>,
                  <Link to="/Member/Signup" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <MenuItem>
                      <Typography textAlign="center">加入會員</Typography>
                    </MenuItem>
                  </Link>,
                  <Link to="/Admin/Login" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <MenuItem>
                      <Typography textAlign="center">後台管理</Typography>
                    </MenuItem>
                  </Link>
                ]
              )}
              {/* {settings.map((setting) => (
                <Link to={`/${setting.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                </Link>
              ))} */}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      </Toolbar>
    </AppBar>
     <Toolbar/>
     </React.Fragment>
  );
}
export default ResponsiveAppBar;
