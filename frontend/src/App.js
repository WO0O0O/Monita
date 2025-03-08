import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Components
import AppHeader from './components/AppHeader';
import AppSidebar from './components/AppSidebar';

// Pages
import Dashboard from './pages/Dashboard';
import WebsiteList from './pages/WebsiteList';
import WebsiteDetail from './pages/WebsiteDetail';
import AddWebsite from './pages/AddWebsite';
import EditWebsite from './pages/EditWebsite';
import Settings from './pages/Settings';
import Help from './pages/Help';
import NotFound from './pages/NotFound';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppHeader onDrawerToggle={handleDrawerToggle} />
        <AppSidebar open={drawerOpen} onDrawerToggle={handleDrawerToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 240px)` },
            mt: 8, // Add margin top to account for the AppHeader height
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/websites" element={<WebsiteList />} />
            <Route path="/websites/:id" element={<WebsiteDetail />} />
            <Route path="/websites/:id/edit" element={<EditWebsite />} />
            <Route path="/add-website" element={<AddWebsite />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
