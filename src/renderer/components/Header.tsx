import React from 'react';
import {
  AppBar,
  Toolbar,
  // Typography,
  Button,
  TextField,
  Box,
} from '@mui/material';

function Header() {
  return (
    <AppBar position="fixed">
      <Toolbar>
        {/* <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Toolbar
        </Typography> */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search References..."
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
          />
          <Button color="inherit">Create Library</Button>
          <Button color="inherit">Sign Up</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
