import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const steps = [
  { key: 'new', label: 'New Submission Consideration' },
  { key: 'initial_review', label: 'Initial Review' },
  { key: 'plagiarism', label: 'Plagiarism Check' },
  { key: 'desk_review', label: 'Desk Review' },
  { key: 'peer_review', label: 'Peer Review' },
  { key: 'decision', label: 'Decision Making' },
  { key: 'response', label: 'Author’s Response' },
  { key: 'publishing', label: 'Publishing Process' },
];

const SubmissionDetails = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/submissions/${submissionId}/`);
        setSubmission(res.data);
      } catch (error) {
        console.error('Failed to fetch submission', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [submissionId]);

  const getActiveStep = () => {
    if (!submission?.phase) return 0;
    const index = steps.findIndex((step) => step.key === submission.phase);
    return index === -1 ? 0 : index;
  };

  if (loading) return <CircularProgress sx={{ m: 4 }} />;
  if (!submission) return <Typography sx={{ p: 3 }}>Submission not found.</Typography>;

  const currentStep = steps[getActiveStep()]?.label || 'Unknown Phase';

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/submissions')} sx={{ color: '#6a1b9a' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography
          sx={{ color: '#6a1b9a', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/submissions')}
        >
          Back to Submissions
        </Typography>
      </Box>

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        SUBMISSION <span style={{ color: '#6a1b9a' }}>#{submission.id}</span>{' '}
        <span style={{ fontWeight: 'normal', color: '#6a1b9a' }}>
          {submission.status}
        </span>
      </Typography>

      {/* Current Step Label */}
      <Typography variant="subtitle1" gutterBottom sx={{ color: '#6a1b9a', mb: 1 }}>
        Current Phase: {currentStep}
      </Typography>

      {/* Progress Stepper */}
      <Box sx={{ width: '100%', mb: 3 }}>
        <Stepper activeStep={getActiveStep()} alternativeLabel>
          {steps.map((step) => (
            <Step key={step.key}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Submission Details */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          GENERAL
        </Typography>
        <List>
          <ListItem disableGutters>
            <Typography variant="subtitle2" width={120}>
              Title:
            </Typography>
            <Typography>{submission.title}</Typography>
          </ListItem>
          <ListItem disableGutters>
            <Typography variant="subtitle2" width={120}>
              Authors:
            </Typography>
            <Typography>{submission.authors?.join(', ') || submission.username}</Typography>
          </ListItem>
          <ListItem disableGutters>
            <Typography variant="subtitle2" width={120}>
              Journal:
            </Typography>
            <Typography>{submission.journal_title}</Typography>
          </ListItem>
          <ListItem disableGutters>
            <Typography variant="subtitle2" width={120}>
              Abstract:
            </Typography>
            <Typography>{submission.abstract || '—'}</Typography>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default SubmissionDetails;
