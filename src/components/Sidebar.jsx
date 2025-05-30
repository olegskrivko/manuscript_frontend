import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonIcon from '@mui/icons-material/Person';
import EastIcon from '@mui/icons-material/East';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navItems = [
    { text: 'Submissions', icon: <EastIcon />, path: '/submissions' },
    { text: 'Journals', icon: <ContentCopyIcon />, path: '/journals' },
    { text: 'Users', icon: <PersonIcon />, path: '/users' },
  ];

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/api/users/current/`);
        setUser(response.data);
      } catch (err) {
        setError('Failed to load user info');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <Box
      sx={{
        width: collapsed ? 72 : 240,
        transition: 'width 0.3s ease',
        bgcolor: '#6a1b9a',
               background: 'linear-gradient(135deg, #6a1b9a, #9c27b0)',
        color: 'white',
        minHeight: '100vh',
        p: 2,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
         <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
   <ListItemButton
  component={Link}
  to="/"
  disableRipple
  sx={{
    justifyContent: collapsed ? 'center' : 'flex-start',
    '&:hover': { bgcolor: 'transparent' },
  }}
>     

     <IconButton
                  disableRipple
                  sx={{
                    bgcolor: 'white',
                     bgcolor: 'secondary.main',
                    color:  '#6a1b9a',
                    borderRadius: '50%',
                    p: 1,
                  }}
                >
                   <AutoStoriesIcon sx={{color: "white"}} />
                </IconButton>

                
  {!collapsed && (
    <ListItemText
      primary={"M.M.S"}
      primaryTypographyProps={{
        sx: {
          ml: 2,
          color: 'white',
          fontSize: '1rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      }}
    />
  )}
</ListItemButton>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
       
        //   flexDirection: 'column',
        }}
      >
        
<ListItemButton
  disableRipple
  component={user ? Link : 'div'}
  to={user ? `/users/${user.id}` : '#'}
  sx={{
    justifyContent: collapsed ? 'center' : 'flex-start',
    mb: 1,
    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' },
  }}
>
  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
    {user && user.first_name.charAt(0)}
  </Avatar>

  {!collapsed && (
    <ListItemText
      primary={
        loading ? 'Loading...' :
        error ? 'Error' :
        // user ? `${user.first_name} ${user.last_name}` : ''
          user ? `${user.first_name} ${user.last_name}` : ''
      }
      primaryTypographyProps={{
        sx: {
          ml: 2,
          color: 'white',
          fontSize: '0.875rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
          textTransform: "capitalize",
        },
      }}
    />
  )}
</ListItemButton>

      </Box>

      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)'}} />
      <Box sx={{ flexGrow: 1 }}>
        <List>
          {navItems.map((item) => {
            const selected = location.pathname.startsWith(item.path);

            return (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' },
                }}
              >
                <IconButton
                  disableRipple
                  sx={{
                    bgcolor: 'white',
                    color: selected ? '#4a148c' : '#6a1b9a',
                    borderRadius: '50%',
                    p: 1,
                  }}
                >
                  {item.icon}
                </IconButton>

                {!collapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      sx: {
                        textTransform: 'uppercase',
                        ml: 2,
                        color: selected ? 'white' : 'rgba(255, 255, 255, 0.7)',
                        fontWeight: selected ? 'bold' : 'normal',
                      },
                    }}
                  />
                )}
              </ListItemButton>
            );
          })}
        </List>
        <Box sx={{
          mt: 'auto',
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-end',
        }}
      >
        <IconButton onClick={toggleSidebar} sx={{ color: 'white' }}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
