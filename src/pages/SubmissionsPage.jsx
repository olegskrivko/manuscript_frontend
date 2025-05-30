import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Pagination, TextField, MenuItem, Grid, InputAdornment, FormControl, InputLabel,
  Select, FormControlLabel, RadioGroup, Radio, Skeleton
} from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ReplayIcon from '@mui/icons-material/Replay';
import TuneIcon from '@mui/icons-material/Tune';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // for 'new' phase
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Submissions = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');
  const [isOverdueFilter, setIsOverdueFilter] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [submissions, setSubmissions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('');
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const toggleFilter = () => setShowFilter(prev => !prev);

const handleSort = (field) => {
  let actualField = field;
  if (field === 'journal') {
    actualField = 'journal__journal_title'; // map journal to its actual backend field
  }

  if (sortField === actualField) {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  } else {
    setSortField(actualField);
    setSortDirection('asc');
  }
  setPage(1);
};
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (initialLoad) setLoading(true);
      try {
        const params = {
  page,
  status: statusFilter || undefined,
  phase: phaseFilter || undefined,
  is_overdue: isOverdueFilter !== null ? isOverdueFilter : undefined,
};

if (sortField) {
  params.ordering = sortDirection === 'asc' ? sortField : `-${sortField}`;
}

const response = await axios.get(`${API_BASE_URL}/api/submissions/`, {
  params
});

        setSubmissions(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 20));
      } catch (error) {
        console.error('Failed to fetch submissions', error);
      } finally {
        if (initialLoad) {
          setInitialLoad(false);
          setLoading(false);
        }
      }
    };
    fetchSubmissions();
  }, [statusFilter, phaseFilter, page, sortField, sortDirection]);

  const overdueCount = submissions.filter(sub => sub.is_overdue).length;

  const newCount = submissions.filter(sub => sub.phase === 'new').length;
  const columns = [
    { label: 'ID', field: 'id', width: '5%', sortable: true },
    { label: 'TITLE', field: 'title', width: '20%', sortable: true },
    { label: 'AUTHOR', field: 'author', width: '10%', sortable: false },
    { label: 'JOURNAL', field: 'journal', width: '20%', sortable: true },
    { label: 'PHASE', field: 'phase', width: '15%', sortable: true },
    { label: 'STATUS', field: 'status', width: '10%', sortable: true },
    { label: 'SUBMITTED', field: 'submission_date', width: '10%', sortable: true },
    { label: 'LAST ACTION', field: 'last_action_date', width: '10%', sortable: true },
  ];

  return (
    <Box>
            {/* Your UI (header, filters, etc.) */}
            {/* Top Controls (Overdue, New, Filter, Default) */}
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>SUBMISSIONS</Typography>
  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
    <Button startIcon={<AccessTimeIcon color="error" />} variant="contained"  sx={{ backgroundColor: '#fff', color: "#000", fontWeight: 'bold', borderRadius: '20px', textTransform: 'capitalize' }} onClick={() => {
    setStatusFilter('');
    setPhaseFilter('');
    setIsOverdueFilter(true);  // ✅ This line enables the is_overdue filter
    setPage(1);
  }}>Overdue<Typography component="span" color="error" sx={{ ml: 1, fontWeight: 'bold' }}>{overdueCount}</Typography>
    </Button>
    <Button startIcon={<ArrowCircleUpIcon color="success" />} variant="contained"  sx={{ backgroundColor: '#fff', color: "#000", fontWeight: 'bold', borderRadius: '20px', textTransform: 'capitalize' }} onClick={() => {
  setStatusFilter('');
  setIsOverdueFilter(null); // 👈 Clear overdue filter
  setPhaseFilter('new');    // 👈 Set phase filter to 'new'
  setPage(1);               // 👈 Reset to first page
}}
>New<Typography component="span" color="success" sx={{ ml: 1, fontWeight: 'bold' }}>{newCount}</Typography>
    </Button>
    <Button onClick={() => toggleFilter()} startIcon={<TuneIcon sx={{color: showFilter ? '#fff' : '#f4c542'}} />} variant="contained" sx={{ backgroundColor: showFilter ? '#f4c542' : '#fff', color: showFilter ? '#fff' : '#000',  fontWeight: 'bold', borderRadius: '20px', textTransform: 'capitalize' }}>Filter</Button>
    <Button startIcon={<ReplayIcon color="secondary" />} variant="text" onClick={() => {
    setStatusFilter('');
    setPhaseFilter('');
    setIsOverdueFilter(null);  // ✅ reset this too
    setSortField('');
    setSortDirection('');
    setPage(1);
  }} sx={{ backgroundColor: '#fff', color: "#000", fontWeight: 'bold', borderRadius: '20px', textTransform: 'uppercase' }}>Set to default</Button>
  </Box>


{/* Journal Toggle Tabs */}
<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, }}>
  <Button variant="contained" sx={{ backgroundColor: '#8041a6' }}>MY JOURNALS</Button>
  <Button variant="outlined">ALL JOURNALS</Button>
</Box>
</Box>
{/* Filter Box */}
 
{showFilter && (
<Paper sx={{ mt: 2, px: 2, pb: 2, borderTop: '4px solid #f4c542', boxShadow: 2, }}>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2,  }}>


     <Box sx={{width: '100%', display: "flex",  alignItems: 'flex-end', }}>
<Box style={{display: "flex", flexDirection: "column"}}>
 <FormControl component="fieldset">
  <RadioGroup
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    sx={{ flexDirection: 'column' }}
    
   
  >
    <FormControlLabel
      value="Active"
      control={<Radio color="primary"  disabled />}
      label="Active"
      
    />
    <FormControlLabel
   
      value="Archive"
      control={<Radio color="primary"  disabled />}
      label="Archive"
      style={{paddingBottom: "0rem"}}
    />
  </RadioGroup>
</FormControl>
    </Box>
     <Box sx={{width: '100%' }}>
           
      <Grid container spacing={2} mt={2}>
        <Grid size={6}>
          <TextField
            variant="standard"
            label="Title"
            name=""
            disabled
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }
            }}
          />
        </Grid>
          <Grid size={3}>
          <TextField
            variant="standard"
            label="Author or co-author"
            name=""
            disabled
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }
            }}
          />
        </Grid>
          <Grid size={3}>
          <TextField
            variant="standard"
            label="Journal"
            name=""
            disabled
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={2}>
        <Grid size={3}>
          <TextField
            variant="standard"
            label="ID"
            disabled
            name=""
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }
            }}
          />
        </Grid>
          <Grid size={3}>
          <TextField
            variant="standard"
            label="From - To"
            name=""
            disabled
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarTodayIcon color="action" />
                  </InputAdornment>
                )
              }
            }}
          />
        </Grid>
      <Grid size={3}>
  <FormControl variant="standard" fullWidth>
    <InputLabel id="status-label">Status</InputLabel>
    {/* <Select labelId="status-label" defaultValue=""> */}
       <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
      <MenuItem value=""><em>None</em></MenuItem>
      {/* Active Statuses */}
      <MenuItem value="in_progress">In progress</MenuItem>
      <MenuItem value="author_revision">Author’s revision</MenuItem>
      {/* Archived Statuses */}
      <MenuItem value="rejected">Rejected</MenuItem>
      <MenuItem value="publication">Publication Process</MenuItem>
    </Select>
  </FormControl>
        </Grid>
<Grid size={3}>
  <FormControl variant="standard" fullWidth>
    <InputLabel id="phase-label">State</InputLabel>
    {/* <Select labelId="phase-label" defaultValue=""> */}
    <Select value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)}>
      <MenuItem value=""><em>None</em></MenuItem>
      <MenuItem value="new">New Submission Consideration</MenuItem>
      <MenuItem value="initial_review">Initial Review</MenuItem>
      <MenuItem value="plagiarism">Plagiarism Check</MenuItem>
      <MenuItem value="desk_review">Desk Review</MenuItem>
      <MenuItem value="peer_review">Double Blind Peer Review</MenuItem>
      <MenuItem value="decision">Decision Making</MenuItem>
      <MenuItem value="response">Author’s Response</MenuItem>
      <MenuItem value="publishing">Publishing Process</MenuItem>
    </Select>
  </FormControl>
</Grid>
      </Grid>
      </Box>
      </Box>
    
    {/* Search Icon */}
    <Button sx={{
      minWidth: 40,
      height: 40,
      borderRadius: '50%',
      backgroundColor: '#f4c542',
      color: '#fff',
      '&:hover': { backgroundColor: '#e3b937' }
    }}>
    <SearchIcon />
    </Button>
  </Box>
</Paper>
)}

      {/* Table */}
      <Paper sx={{ mt: 3, px: 2, borderTop: '4px solid #8041a6', boxShadow: 2, position: 'relative' }}>
        {loading && !initialLoad && (
          <Box sx={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.6)', zIndex: 1
          }} />
        )}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map(({ field, label }) => (
                  <TableCell
                    key={field}
                    onClick={() => handleSort(field)}
                    sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      <Box component="span">{label}</Box>
                  
                      {(sortField === field || (field === 'journal' && sortField === 'journal__journal_title')) && (
  sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
)}

                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            
            <TableBody>
  {loading && initialLoad ? (
    [...Array(10)].map((_, idx) => (
      <TableRow key={idx}>
        {columns.map(col => (
          <TableCell key={col.field}>
            <Skeleton variant="text" width="100%" />
          </TableCell>
        ))}
      </TableRow>
    ))
  ) : (
    submissions.map((sub) => (
      <TableRow key={sub.id}>
  {columns.map((col) => (
    <TableCell
      key={col.field}
      sx={{
        whiteSpace: 'wrap',
        // fontWeight: sub.is_overdue ? 'bold' : 'normal',
            fontWeight: (sub.is_overdue || sub.phase === 'new') ? 'bold' : 'normal',
      }}
    >
      {col.field === 'title' ? (
        <Link
          to={`/submissions/${sub.id}`}
          style={{
            color: '#6a1b9a',
            textDecoration: 'none',
            fontWeight: 500,
            display: 'block',
            whiteSpace: 'wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {sub[col.field]}
        </Link>
       
      ) : col.field === 'author' ? (
         // later change to author
        sub.first_name + " " + sub.last_name
      ) : col.field === 'journal' ? (
        sub.journal_title
      ) : col.field === 'id' ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', minWidth: 32 }}>
          {sub.is_overdue ? (
            <AccessTimeIcon
              sx={{ color: 'red', fontSize: 18, marginRight: 0.5 }}
            />
          ) : sub.phase === 'new' ? (
            <ArrowCircleUpIcon
              sx={{ color: 'green', fontSize: 18, marginRight: 0.5 }}
            />
          ) : (
            <span style={{ width: 18, marginRight: 4 }} />
          )}
          {sub[col.field]}
        </span>
      ) : (
        sub[col.field]
      )}
    </TableCell>
  ))}
</TableRow>

    
    ))
  )}
</TableBody>

          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} variant="outlined" shape="rounded" color="secondary" />
        </Box>
      </Paper>
    </Box>
  );
};

export default Submissions;
