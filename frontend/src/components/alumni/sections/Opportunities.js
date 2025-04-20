import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Fab,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Work as WorkIcon,
  LocationOn,
  Business,
  AttachMoney,
  Person,
  AccessTime,
  Description,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../../contexts/AuthContext';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s, box-shadow 0.2s',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
}));

const JobPosting = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3002/api/jobs/alumni', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Fetched jobs:', response.data); // Debug log
        setJobs(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError(error.response?.data?.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user._id]);

  const handlePostJob = () => {
    navigate('/alumni/post-job');
  };

  const handleEditJob = (jobId) => {
    navigate(`/alumni/edit-job/${jobId}`);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3002/api/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setJobs(jobs.filter(job => job._id !== jobId));
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job posting');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ 
      p: 3, 
      width: '100%', 
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        bgcolor: 'transparent',
        borderRadius: 2,
        boxShadow: 'none'
      }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main',
            mb: 1
          }}>
            My Freelance Postings
          </Typography>
          <Typography variant="subtitle1" sx={{ 
            color: '#666666',
            fontSize: '1.1rem',
            fontWeight: 500
          }}>
            Manage and track your freelance postings and applications
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handlePostJob}
          sx={{
            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
            },
            px: 3,
            py: 1.5,
            borderRadius: 2,
          }}
        >
          Post New Work
        </Button>
      </Box>

      {jobs.length === 0 ? (
        <Box 
          textAlign="center" 
          py={8}
          sx={{
            bgcolor: 'transparent',
            borderRadius: 2,
            p: 4,
            boxShadow: 'none'
          }}
        >
          <WorkIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No freelance postings yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start by posting your first freelance opportunity to help students find great opportunities.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handlePostJob}
            sx={{ mt: 2 }}
          >
            Post Your First Work
          </Button>
        </Box>
      ) : (
        <Grid 
          container 
          spacing={3}
          sx={{
            width: '100%',
            maxWidth: '100%',
            margin: 0,
            padding: 0
          }}
        >
          {jobs.map((job) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={job._id}
              sx={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <StyledCard sx={{ height: '100%' }}>
                <CardContent sx={{ 
                  p: 3, 
                  backgroundColor: '#ffffff',
                  '&:last-child': {
                    pb: 3
                  }
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h5" component="h2" gutterBottom sx={{ 
                        fontWeight: 'bold', 
                        color: '#000000',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {job.projectTitle}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                        <Chip
                          icon={<Business />}
                          label={job.category}
                          variant="outlined"
                          size="small"
                          sx={{ 
                            color: '#000000', 
                            borderColor: 'rgba(0, 0, 0, 0.2)',
                            backgroundColor: '#ffffff'
                          }}
                        />
                        <Chip
                          icon={<AttachMoney />}
                          label={`${job.budget} (${job.paymentType})`}
                          variant="outlined"
                          size="small"
                          sx={{ 
                            color: '#000000', 
                            borderColor: 'rgba(0, 0, 0, 0.2)',
                            backgroundColor: '#ffffff'
                          }}
                        />
                        <Chip
                          icon={<AccessTime />}
                          label={`${job.experienceLevel} Level`}
                          variant="outlined"
                          size="small"
                          sx={{ 
                            color: '#000000', 
                            borderColor: 'rgba(0, 0, 0, 0.2)',
                            backgroundColor: '#ffffff'
                          }}
                        />
                      </Stack>
                    </Box>
                    <Badge 
                      badgeContent={Array.isArray(job.applicants) ? job.applicants.length : 0} 
                      color="primary"
                      sx={{ 
                        '& .MuiBadge-badge': {
                          right: -3,
                          top: 3,
                          border: '2px solid #ffffff',
                          padding: '0 4px',
                        }
                      }}
                    >
                      <Chip
                        icon={<Person />}
                        label="Applicants"
                        variant="outlined"
                        size="small"
                        sx={{ 
                          color: '#000000', 
                          borderColor: 'rgba(0, 0, 0, 0.2)',
                          backgroundColor: '#ffffff'
                        }}
                      />
                    </Badge>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ 
                      fontWeight: 'medium', 
                      color: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Description fontSize="small" />
                      Description
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ 
                      color: '#000000',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {job.projectDescription}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ 
                      fontWeight: 'medium', 
                      color: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Description fontSize="small" />
                      Required Skills
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ 
                      color: '#000000',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {job.requiredSkills}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid rgba(0, 0, 0, 0.1)'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime fontSize="small" sx={{ color: '#000000' }} />
                      <Typography variant="caption" sx={{ color: '#000000' }}>
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Applications">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/alumni/applications?jobId=${job._id}`)}
                          sx={{ color: '#000000' }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Job">
                        <IconButton
                          size="small"
                          onClick={() => handleEditJob(job._id)}
                          sx={{ color: '#000000' }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Job">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteJob(job._id)}
                          sx={{ color: '#000000' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        color="primary"
        aria-label="add"
        onClick={handlePostJob}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
          },
        }}
      >
        <WorkIcon />
      </Fab>
    </Box>
  );
};

export default JobPosting; 