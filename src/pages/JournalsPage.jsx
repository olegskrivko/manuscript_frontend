import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash.debounce';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Pagination, Autocomplete, TextField, Skeleton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Journals = () => {
  const columns = [
    { field: 'journal_id', label: 'ID' },
    { field: 'journal_title', label: 'TITLE' },
    { field: 'issn_print', label: 'ISSN (PRINT)' },
    { field: 'issn_online', label: 'ISSN (ONLINE)' },
    { field: 'status', label: 'STATUS' },
  ];

  const [journals, setJournals] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [ordering, setOrdering] = useState('journal_title');
  const [sortDirection, setSortDirection] = useState('asc');

  const [searchInput, setSearchInput] = useState('');
  const [searchOptions, setSearchOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchJournals = async () => {
    setLoading(true);
    try {
      const orderingParam = sortDirection === 'asc' ? ordering : `-${ordering}`;
  
        const res = await axios.get(`${API_BASE_URL}/api/journals/?page=${page}&ordering=${orderingParam}`);

      setJournals(res.data.results);
      setCount(res.data.count);

      if (initialLoad) setInitialLoad(false);
    } catch (err) {
      console.error("Error fetching journals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, [page, ordering, sortDirection]);

  const handleSort = (field) => {
    if (ordering === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrdering(field);
      setSortDirection('asc');
    }
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const totalPages = Math.ceil(count / 20);

  const fetchSearchSuggestions = debounce(async (query) => {
    if (!query) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/journals/search/?query=${query}`);
      setSearchOptions(res.data.results || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  }, 300);

  const handleInputChange = (event, value) => {
    setSearchInput(value);
    if (value.length > 0) {
      fetchSearchSuggestions(value);
    } else {
      setSearchOptions([]);
    }
  };

  const handleSelection = (event, value) => {
    if (value) {
      const selected = searchOptions.find(j => j.journal_title === value);
      if (selected) {
        setJournals([selected]);
        setCount(1);
        setPage(1);
      }
    } else {
      setSearchInput('');
      setSearchOptions([]);
      fetchJournals();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',mt: 2  }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>JOURNALS</Typography>
        <Button
          component={Link}
          to="/journals/create"
          variant="contained"
          sx={{ bgcolor: '#9c27b0' }}
          startIcon={<AddIcon />}
        >
          CREATE NEW JOURNAL
        </Button>
      </Box>

      <Paper sx={{ mt: 3, px: 2, pt: 2, boxShadow: 2 }}>
        <Autocomplete
          freeSolo
          options={searchOptions.map(option => option.journal_title)}
          inputValue={searchInput}
          onInputChange={handleInputChange}
          onChange={handleSelection}
          sx={{ width: '100%' }}
          renderInput={(params) => (
            <TextField {...params} label="Search journal" variant="standard" fullWidth />
          )}
        />

        <TableContainer>
   
          <Table >
            <TableHead>
              <TableRow>
                {columns.map(({ field, label }) => {
                  const width = field === 'journal_id' ? '5%' :
                    field === 'journal_title' ? '50%' : '15%';

                  return (
                    <TableCell
                      key={field}
                      onClick={() => handleSort(field)}
                      sx={{
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        width,
                      }}
                    >
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                        <Box component="span">{label}</Box>
                        {ordering === field &&
                          (sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />)}
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && initialLoad ? (
                // Show skeletons only on initial load
                Array.from({ length: 20 }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`}>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                  </TableRow>
                ))
              ) : (
                // Show data rows (keep old data while loading on subsequent fetches)
                journals.map((journal) => (
                  <TableRow key={journal.journal_id}>
                    <TableCell sx={{ width: '5%' }}>{journal.journal_id}</TableCell>
                    <TableCell sx={{ width: '50%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Link
                        to={`/journals/${journal.journal_id}`}
                        style={{
                          color: '#6a1b9a',
                          textDecoration: 'none',
                          fontWeight: 500,
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {journal.journal_title}
                      </Link>
                    </TableCell>
                    <TableCell sx={{ width: '15%' }}>{journal.issn_print || '-'}</TableCell>
                    <TableCell sx={{ width: '15%' }}>{journal.issn_online || '-'}</TableCell>
                    <TableCell sx={{ width: '15%' }}>{journal.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, mt: 'auto' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            color="secondary"
            disabled={loading}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Journals;
