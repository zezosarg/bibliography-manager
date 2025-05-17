import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Menu,
} from '@mui/material';
import icon from '../../../assets/icon.png';
// import SplitButton from './SplitButton';

interface HeaderProps {
  onSearch: (query: string, searchField: string) => void;
  onFindDuplicates: () => void;
  onHandleMenuAction: (action: string) => void;
}

function Header({
  onSearch,
  onFindDuplicates,
  onHandleMenuAction,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
    <AppBar position="fixed" color="info">
      <Toolbar>
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
            // color="inherit"
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
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="author">Author</MenuItem>
              <MenuItem value="year">Year</MenuItem>
              <MenuItem value="journal">Journal</MenuItem>
              <MenuItem value="publisher">Publisher</MenuItem>
              <MenuItem value="key">Key</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="info" variant="contained" onClick={handleMenuClick}>
            Export to clipboard
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                onHandleMenuAction('bib');
                handleMenuClose(); // Close the menu
              }}
            >
              BibTeX
            </MenuItem>
            <MenuItem
              onClick={() => {
                onHandleMenuAction('html');
                handleMenuClose(); // Close the menu
              }}
            >
              HTML
            </MenuItem>
          </Menu>
          <Button color="info" variant="contained" onClick={onFindDuplicates}>
            Find Duplicates
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
