import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Grid,
  Button,
  IconButton,
  Snackbar,
  Avatar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);




  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/users/${userId}/`);
        setUser(data);
        setSelectedRole(data.role || '');
      } catch (err) {
        console.error(err);
        setSnackbar({ open: true, message: 'Error fetching user.', severity: 'error' });
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setSelectedRole(e.target.value);
  };


  const handleLogout = async () => {
  try {


    await axios.post(
      `${API_BASE_URL}/api/auth/logout/`  );


    window.location.href = '/login';
  } catch (err) {
    console.error('Logout failed:', err);
  }
};

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/users/${userId}/`);
      setSnackbar({ open: true, message: 'Account deleted.', severity: 'success' });
      setTimeout(() => {
        handleLogout();
      }, 1000);
    } catch (err) {
      setSnackbar({ open: true, message: 'Delete failed.', severity: 'error' });
    }
    setDeleteDialogOpen(false);
  };
  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/users/${userId}/`, { role: selectedRole });
      setSnackbar({ open: true, message: 'Role updated.', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Update failed.', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!user) return null;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        USER PROFILE
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={() => navigate('/users')}
          size="small"
          sx={{ color: '#6a1b9a' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          component={RouterLink}
          to="/users"
          sx={{ textDecoration: 'none', color: '#6a1b9a', fontWeight: 'bold' }}
        >
          Back to Users
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
                {/* Profile Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{ width: 80, height: 80, bgcolor: 'secondary.main', mr: 3 }}
          >
            {user.first_name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.username}
            </Typography>
          </Box>
        </Box>
        <Grid container spacing={2}>
         <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              variant="standard"
              label="First Name"
              value={user.first_name || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              variant="standard"
              label="Last Name"
              value={user.last_name || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={1}>
           <Grid item size={{ xs: 12, sm: 6 }}>
         <TextField
    variant="standard"
    label="Role"
    value={user?.role || ''}
    fullWidth
    InputProps={{
      readOnly: true,
    }}
  />
          </Grid>
           <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              variant="standard"
              label="Degree"
              value={user.degree || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={1}>
            <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              variant="standard"
              label="Faculty"
              value={user.faculty || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              variant="standard"
              label="Department"
              value={user.department || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={1}>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              variant="standard"
              label="University"
              value={user.university || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
           <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              variant="standard"
              label="City"
              value={user.city || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={1}>
         <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              variant="standard"
              label="Country"
              value={user.country || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              variant="standard"
              label="Personal Webpage"
              value={user.personal_webpage || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
          disabled
            variant="contained"
            sx={{ bgcolor: '#9c27b0' }}
            onClick={handleUpdate}
  
          >
            Update Role
          </Button>
                    <Button
            variant="contained"
            disabled
            sx={{ bgcolor: '#6a1b9a' }}
            onClick={() => navigate(`/submit-article?user=${userId}`)}
          >
            Submit Article
          </Button>
        </Box>
      </Paper>
  <Paper sx={{ p: 3, mt: 3, }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between',  flexWrap: 'wrap', gap: 1 }}>
    
  
          <Button
            variant="outlined"
            color="warning"
            disabled
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>


          <Button
          disabled
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Account
          </Button>
        </Box>
        </Paper>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>

            {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action is irreversible. Are you sure you want to delete your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;
