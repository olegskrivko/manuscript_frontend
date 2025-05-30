
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  MenuItem,
  Paper,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { styled } from '@mui/material/styles';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const RequiredTextField = styled(TextField)(({ theme }) => ({
  '& label.MuiFormLabel-root.Mui-required': {
    '& .MuiInputLabel-asterisk': {
      color: theme.palette.error.main,
    },
  },
}));

const JournalDetails = () => {
  const { journalId } = useParams();
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    journal_title: '',
    publisher: '',
    founder: '',
    issn_print: '',
    issn_online: '',
    issued_since_month: '',
    issued_since_year: '',
    status: '',
  });
  const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1899 }, (_, i) => 1900 + i);

const statuses = ["Active", "Inactive"];
useEffect(() => {
  const fetchJournal = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/journals/${journalId}/`);
      setJournal(res.data);

      // Directly set issued_since_month and issued_since_year from backend fields
      setFormData({
        journal_title: res.data.journal_title || '',
        publisher: res.data.publisher || '',
        founder: res.data.founder || '',
        issn_print: res.data.issn_print || '',
        issn_online: res.data.issn_online || '',
        issued_since_month: res.data.issued_since_month || '',  // Use as-is
        issued_since_year: res.data.issued_since_year ? res.data.issued_since_year.toString() : '',  // convert year to string
        status: res.data.status || '',
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch journal details', error);
      setLoading(false);
    }
  };

  fetchJournal();
}, [journalId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

const handleUpdate = async () => {
  try {
    const dataToSend = { ...formData };

    // Remove empty status so backend can apply default
    if (!dataToSend.status) {
      delete dataToSend.status;
    }

    // Do not construct a combined date
    // Keep issued_since_month and issued_since_year

    await axios.put(`${API_BASE_URL}/api/journals/${journalId}/edit/`, dataToSend, );
    alert('Journal updated successfully!');
  } catch (error) {
    console.error('Failed to update journal', error);
    alert('Update failed, please try again.');
  }
};

  if (loading) return <CircularProgress />;

  if (!journal) return <Typography>Journal not found.</Typography>;

  return (
    <Box >


      <Typography variant="h5" fontWeight="bold" mb={3}>
        EDIT JOURNAL
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={() => navigate('/journals')}
          size="small"
          sx={{ color: '#6a1b9a' }}
          aria-label="Back to journals"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          component={RouterLink}
          to="/journals"
          sx={{ textDecoration: 'none', color: '#6a1b9a', fontWeight: 'bold' }}
        >
          Back to Journals
        </Typography>
      </Box>
  

<Paper sx={{ p: 3, width: '100%' }}>
  <Grid container spacing={2}>
    <Grid size={{ xs: 12, sm: 6 }}>
      <TextField
        variant="standard"
        label="Journal ID"
        value={journal.journal_id}
        fullWidth
        slotProps={{ input: { readOnly: true } }}
        disabled
      />
    </Grid>
  </Grid>

  <Grid container spacing={2} mt={2}>
    <Grid size={6}>
      <RequiredTextField
        variant="standard"
        label="Title"
        name="journal_title"
        value={formData.journal_title}
        onChange={handleChange}
        fullWidth
        required
      />
    </Grid>
    <Grid size={6}>
      <RequiredTextField
        variant="standard"
        label="Publisher"
        name="publisher"
        value={formData.publisher}
        onChange={handleChange}
        fullWidth
        required
      />
    </Grid>
  </Grid>

  <Grid container spacing={2} mt={2}>
    <Grid size={{ xs: 12, sm: 6 }}>
      <RequiredTextField
        variant="standard"
        label="Founder"
        name="founder"
        value={formData.founder}
        onChange={handleChange}
        fullWidth
        required
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 6 }}>
      <RequiredTextField
        variant="standard"
        label="ISSN (Print)"
        name="issn_print"
        value={formData.issn_print}
        onChange={handleChange}
        fullWidth
        required
      />
    </Grid>
  </Grid>

  <Grid container spacing={2} mt={2}>
    <Grid size={{ xs: 12, sm: 6 }}>
      <RequiredTextField
        variant="standard"
        label="ISSN (Online)"
        name="issn_online"
        value={formData.issn_online}
        onChange={handleChange}
        fullWidth
        required
      />
    </Grid>

    <Grid size={{ xs: 12, sm: 6 }} container spacing={1}>
              <Grid size={6}>
          <RequiredTextField
            select
            variant="standard"
            label="Issued Since (Month)"
            name="issued_since_month"
            value={formData.issued_since_month}
            onChange={handleChange}
            fullWidth
            required
          >
            {months.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </RequiredTextField>
        </Grid>
<Grid size={6}>
          <RequiredTextField
            select
            variant="standard"
            label="Issued Since (Year)"
            name="issued_since_year"
            value={formData.issued_since_year}
            onChange={handleChange}
            fullWidth
            required
          >
            {years.map((year) => (
              <MenuItem key={year} value={year.toString()}>
                {year}
              </MenuItem>
            ))}
          </RequiredTextField>
        </Grid>
    </Grid>
  </Grid>

<Grid container spacing={2} mt={2}>
      <Grid size={12}>
        <TextField
          select
          variant="standard"
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          fullWidth
        >
          {statuses.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>

  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
    <Button variant="contained" sx={{ bgcolor: '#9c27b0' }} onClick={handleUpdate}>
      UPDATE JOURNAL
    </Button>
  </Box>
</Paper>



    </Box>
  );
};

export default JournalDetails;
