import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  Avatar,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Link,
  Tooltip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  ExpandMore as ExpandMoreIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import axios from 'axios';

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // First get the applications with status
      const applicationsResponse = await axios.get('http://localhost:3002/api/job-applications/alumni/applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Then get the jobs data
      const jobsResponse = await axios.get('http://localhost:3002/api/jobs/alumni', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Create a map of applications for quick lookup
      const applicationsMap = applicationsResponse.data.reduce((acc, app) => {
        const key = `${app.opportunityId._id}-${app.studentId._id}`;
        acc[key] = app;
        return acc;
      }, {});
      
      // Transform the data to match the expected structure
      const transformedApplications = jobsResponse.data.flatMap(opportunity => 
        opportunity.applicants.map(applicant => {
          const key = `${opportunity._id}-${applicant._id}`;
          const application = applicationsMap[key];
          
          return {
            _id: key,
            jobId: {
              _id: opportunity._id,
              projectTitle: opportunity.projectTitle,
              category: opportunity.category
            },
            studentId: {
              _id: applicant._id,
              name: applicant.name,
              email: applicant.email,
              profile: applicant.profile
            },
            status: application?.status || 'pending'
          };
        })
      );
      
      setApplications(transformedApplications);
      setError(null);
    } catch (error) {
      console.error('Error fetching applications:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const token = localStorage.getItem('token');
      // Extract the opportunity ID and student ID from the composite ID
      const [opportunityId, studentId] = applicationId.split('-');
      
      console.log('Updating status for:', { opportunityId, studentId, status });
      
      // Update the application status directly using the opportunity ID and student ID
      const updateResponse = await axios.put(
        `http://localhost:3002/api/job-applications/update-status`,
        { 
          opportunityId,
          studentId,
          status 
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Status update response:', updateResponse.data);
      
      // Update the local state immediately
      setApplications(prevApplications => 
        prevApplications.map(app => {
          if (app._id === applicationId) {
            return { ...app, status: updateResponse.data.status };
          }
          return app;
        })
      );
    } catch (error) {
      console.error('Error updating application status:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data
      });
      alert(error.response?.data?.message || 'Failed to update application status');
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip icon={<AccessTimeIcon />} label="Pending" color="default" />;
      case 'accepted':
        return <Chip icon={<CheckIcon />} label="Accepted" color="success" />;
      case 'rejected':
        return <Chip icon={<CloseIcon />} label="Rejected" color="error" />;
      default:
        return null;
    }
  };

  // Group applications by job
  const groupedApplications = applications.reduce((acc, application) => {
    console.log('Processing application:', application);
    const jobId = application.jobId._id;
    if (!acc[jobId]) {
      acc[jobId] = {
        job: application.jobId,
        applications: []
      };
    }
    acc[jobId].applications.push(application);
    return acc;
  }, {});

  console.log('Grouped applications:', groupedApplications);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Freelance Applications
      </Typography>

      {Object.keys(groupedApplications).length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No applications received yet.
        </Typography>
      ) : (
        <Stack spacing={3}>
          {Object.values(groupedApplications).map((group) => (
            <Accordion key={group.job._id} defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" component="h2" sx={{ color: 'text.primary' }}>
                      {group.job.projectTitle}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {group.job.category}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${group.applications.length} Applicants`}
                    color="primary"
                    sx={{ mr: 2 }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {group.applications.map((application) => (
                    <ListItem
                      key={application._id}
                      divider
                      sx={{
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              color: 'text.primary',
                              fontWeight: 'medium',
                              fontSize: '1.1rem',
                              mb: 1
                            }}
                          >
                            {application.studentId.name}
                          </Typography>
                        }
                        secondary={
                          <Stack direction="column" spacing={1}>
                            <Stack direction="row" spacing={2}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: 'text.secondary',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <EmailIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                {application.studentId.email}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: 'text.secondary',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <SchoolIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                {application.studentId.profile?.branch} - {application.studentId.profile?.graduationYear}
                              </Typography>
                            </Stack>
                            {application.studentId.profile?.cvLink && (
                              <Tooltip title="View CV">
                                <Link
                                  href={application.studentId.profile.cvLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    '&:hover': {
                                      textDecoration: 'underline',
                                    },
                                  }}
                                >
                                  <DescriptionIcon fontSize="small" sx={{ mr: 0.5 }} />
                                  View CV
                                </Link>
                              </Tooltip>
                            )}
                          </Stack>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Stack direction="row" spacing={1}>
                          {getStatusChip(application.status)}
                          {application.status === 'pending' ? (
                            <>
                              <Button
                                startIcon={<CheckIcon />}
                                color="success"
                                size="small"
                                variant="contained"
                                onClick={() => handleStatusUpdate(application._id, 'accepted')}
                                sx={{ 
                                  bgcolor: 'success.main',
                                  '&:hover': {
                                    bgcolor: 'success.dark',
                                  }
                                }}
                              >
                                Accept
                              </Button>
                              <Button
                                startIcon={<CloseIcon />}
                                color="error"
                                size="small"
                                variant="contained"
                                onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                sx={{ 
                                  bgcolor: 'error.main',
                                  '&:hover': {
                                    bgcolor: 'error.dark',
                                  }
                                }}
                              >
                                Reject
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="contained"
                              size="small"
                              disabled
                              sx={{ 
                                bgcolor: application.status === 'accepted' ? 'success.main' : 'error.main',
                                color: 'white'
                              }}
                            >
                              {application.status === 'accepted' ? 'Accepted' : 'Rejected'}
                            </Button>
                          )}
                        </Stack>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default JobApplications; 