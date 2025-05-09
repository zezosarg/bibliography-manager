import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  // Typography,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  // Typography,
} from '@mui/material';
import icon from '../../../assets/icon.png';

interface HeaderProps {
  onSearch: (query: string, searchField: string) => void;
}

function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query, searchField);
  };
  const handleSearchFieldChange = (event: SelectChangeEvent<string>) => {
    const field = event.target.value;
    setSearchField(field);
  };
  return (
    <AppBar position="fixed">
      <Toolbar>
        {/* <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Toolbar
        </Typography> */}
        <img
          src={icon}
          alt="App Icon"
          style={{
            width: 40,
            height: 40,
            marginRight: 16,
          }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search All References..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ backgroundColor: 'white', borderRadius: 1, width: 300 }}
          />
          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: 150,
              // backgroundColor: 'white', // Set background color to white
              // borderRadius: 1, // Optional: Add rounded corners
              // '& .MuiOutlinedInput-root': {
              //   backgroundColor: 'white', // Ensure the dropdown itself has a white background
              // },
            }}
          >
            <InputLabel>Search Field</InputLabel>
            <Select
              value={searchField}
              onChange={handleSearchFieldChange}
              label="Search Field"
            >
              {/* <MenuItem value="" disabled>
                Select Field
              </MenuItem> */}
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="author">Author</MenuItem>
              <MenuItem value="year">Year</MenuItem>
              <MenuItem value="journal">Journal</MenuItem>
              <MenuItem value="publisher">Publisher</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit">Find Duplicates</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
