import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Fade, Slide } from '@mui/material';
import Lottie from 'lottie-react';
import spinnerAnimation from '../assets/Animation-1748213296902.json';

const LandingSplash = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true); // trigger animations

    const timer = setTimeout(() => {
      navigate('/journals');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6a1b9a, #9c27b0)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <Fade in={showContent} timeout={1000}>
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: 300,
            color: "#FFB4B1",
            transition: 'opacity 0.5s ease',
          }}
        >
         Initializing System...
        </Typography>
      </Fade>

        <Box sx={{ width: 180, height: 180 }}>
          <Lottie animationData={spinnerAnimation} loop autoplay />
        </Box>
    </Box>
  );
};

export default LandingSplash;
