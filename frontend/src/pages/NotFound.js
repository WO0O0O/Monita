import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LanguageIcon from '@mui/icons-material/Language';

function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 120px)',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          maxWidth: 500,
        }}
      >
        <Typography variant="h1" component="h1" sx={{ fontSize: '6rem', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" paragraph>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/websites"
            startIcon={<LanguageIcon />}
          >
            View Websites
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default NotFound;
