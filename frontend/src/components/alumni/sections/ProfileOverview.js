import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Divider,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';

const ProfileOverview = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    graduationYear: '',
    department: '',
    currentPosition: '',
    company: '',
    location: '',
    linkedin: '',
    github: '',
    profilePicture: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        graduationYear: user.profile?.education?.[0]?.year || '',
        department: user.profile?.education?.[0]?.degree || '',
        currentPosition: user.profile?.experience?.[0]?.position || '',
        company: user.profile?.experience?.[0]?.company || '',
        location: user.profile?.location || '',
        linkedin: user.profile?.socialLinks?.linkedin || '',
        github: user.profile?.socialLinks?.github || '',
        profilePicture: user.profile?.profileImage || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      
      const profileData = {
        name: formData.name,
        email: formData.email,
        profile: {
          phone: formData.phone,
          location: formData.location,
          socialLinks: {
            linkedin: formData.linkedin,
            github: formData.github
          },
          profileImage: formData.profilePicture,
          experience: [{
            company: formData.company,
            position: formData.currentPosition,
            duration: 'Current',
            description: ''
          }],
          education: [{
            institution: 'IIT Patna',
            degree: formData.department,
            year: formData.graduationYear,
            description: ''
          }],
          skills: [],
          certifications: [],
          emailVisible: true,
          phoneVisible: true
        }
      };

      const response = await axios.put('http://localhost:3002/api/users/profile', profileData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        // Update the user data in localStorage
        const updatedUser = {
          ...user,
          ...response.data
        };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        
        // Update the user state if updateUser is available
        if (typeof updateUser === 'function') {
          updateUser(updatedUser);
        }
        
        setIsEditing(false);
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '100%',
      bgcolor: '#f0f2f5',
      p: 0,
      m: 0,
      ml: -2
    }}>
      {/* Profile Header */}
      <Box
        sx={{
          height: '120px',
          background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
          position: 'relative',
          mb: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          px: 3,
          pt: 2,
          width: '100%',
          ml: 2
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          position: 'absolute',
          right: 24,
          top: 16,
          zIndex: 2
        }}>
          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
              sx={{
                bgcolor: '#e3f2fd',
                color: '#1a237e',
                '&:hover': {
                  bgcolor: '#bbdefb',
                }
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => setIsEditing(false)}
                sx={{
                  bgcolor: '#ffebee',
                  borderColor: '#c62828',
                  color: '#c62828',
                  '&:hover': {
                    bgcolor: '#ffcdd2',
                    borderColor: '#b71c1c'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={loading}
                sx={{
                  bgcolor: '#1b5e20',
                  color: '#ffffff',
                  '&:hover': {
                    bgcolor: '#2e7d32',
                  },
                  '&:disabled': {
                    bgcolor: '#9e9e9e',
                  }
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </Box>

        <Avatar
          src={formData.profilePicture || '/default-avatar.png'}
          alt={formData.name}
          sx={{
            width: 120,
            height: 120,
            border: '4px solid #e3f2fd',
            position: 'absolute',
            bottom: -60,
            left: { xs: '50%', md: 50 },
            transform: { xs: 'translateX(-50%)', md: 'none' },
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        px: 0,
        pb: 4,
        width: '100%',
        m: 0,
        ml: 2
      }}>
        <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
          {/* Left Column - Basic Info */}
          <Grid item xs={12} sm={12} md={4} sx={{ pl: { xs: 1, md: 2 }, pr: { xs: 1, md: 1 } }}>
            <Stack spacing={2}>
              {/* Basic Info Card */}
              <Card elevation={0} sx={{ 
                bgcolor: '#f5f7fa', 
                borderRadius: 2,
                height: '100%',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#1a237e' }}>
                    Basic Information
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&:hover fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'transparent',
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.12)',
                            },
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#1a237e',
                          '&.Mui-focused': {
                            color: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: '#1a237e',
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                            WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&:hover fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'transparent',
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.12)',
                            },
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#1a237e',
                          '&.Mui-focused': {
                            color: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: '#1a237e',
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                            WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: '#3949ab' }} />
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&:hover fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'transparent',
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.12)',
                            },
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#1a237e',
                          '&.Mui-focused': {
                            color: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: '#1a237e',
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                            WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ mr: 1, color: '#3949ab' }} />
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&:hover fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'transparent',
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.12)',
                            },
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#1a237e',
                          '&.Mui-focused': {
                            color: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: '#1a237e',
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                            WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: <LocationIcon sx={{ mr: 1, color: '#3949ab' }} />
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* Social Links Card */}
              <Card elevation={0} sx={{ 
                bgcolor: '#f5f7fa', 
                borderRadius: 2,
                height: '100%',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#1a237e' }}>
                    Social Links
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="LinkedIn"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&:hover fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'transparent',
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.12)',
                            },
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#1a237e',
                          '&.Mui-focused': {
                            color: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: '#1a237e',
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                            WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: <LinkedInIcon sx={{ mr: 1, color: '#0077b5' }} />
                      }}
                    />
                    <TextField
                      fullWidth
                      label="GitHub"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&:hover fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'transparent',
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.12)',
                            },
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#1a237e',
                          '&.Mui-focused': {
                            color: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: '#1a237e',
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                            WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: <GitHubIcon sx={{ mr: 1, color: '#333' }} />
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Right Column - Professional & Education */}
          <Grid item xs={12} sm={12} md={8} sx={{ pl: { xs: 1, md: 1 }, pr: { xs: 1, md: 2 } }}>
            <Stack spacing={2}>
              {/* Professional Info Card */}
              <Card elevation={0} sx={{ 
                bgcolor: '#f5f7fa', 
                borderRadius: 2,
                height: '100%',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#1a237e' }}>
                    Professional Information
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Current Position"
                      name="currentPosition"
                      value={formData.currentPosition}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&:hover fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'transparent',
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.12)',
                            },
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#1a237e',
                          '&.Mui-focused': {
                            color: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: '#1a237e',
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                            WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: <WorkIcon sx={{ mr: 1, color: '#3949ab' }} />
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&:hover fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'transparent',
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.12)',
                            },
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#1a237e',
                          '&.Mui-focused': {
                            color: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: '#1a237e',
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                            WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: <BusinessIcon sx={{ mr: 1, color: '#3949ab' }} />
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* Education Card */}
              <Card elevation={0} sx={{ 
                bgcolor: '#f5f7fa', 
                borderRadius: 2,
                height: '100%',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#1a237e' }}>
                    Education
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&:hover fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'transparent',
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.12)',
                            },
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#1a237e',
                          '&.Mui-focused': {
                            color: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: '#1a237e',
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                            WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: <SchoolIcon sx={{ mr: 1, color: '#3949ab' }} />
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Graduation Year"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&:hover fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'transparent',
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.12)',
                            },
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#1a237e',
                          '&.Mui-focused': {
                            color: '#3949ab',
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: '#1a237e',
                          '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                            WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Success/Error Messages */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          variant="filled"
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          variant="filled"
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileOverview; 