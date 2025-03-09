import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
import './App.css';
import { useState } from 'react';
import { Box, CssBaseline, Toolbar, Paper, Typography } from '@mui/material';
import Sidebar from './components/Sidebar';

function Home() {
  interface Record {
    name: string;
    age: number;
    job: string;
  }

  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);

  const handleRecordClick = (record: Record) => {
    setSelectedRecord(record);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar onRecordClick={handleRecordClick} />
      {/* <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
        }}
      > */}
      {/* <Toolbar /> */}
      {/* <Typography variant="h4" gutterBottom>
          Main Content Area
        </Typography> */}
      {/* Other content goes here */}
      {/* </Box> */}

      {/* Display selected record details */}
      {selectedRecord ? (
        <Paper sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>
            Record Details
          </Typography>
          <Typography variant="body1">Name: {selectedRecord.name}</Typography>
          <Typography variant="body1">Age: {selectedRecord.age}</Typography>
          <Typography variant="body1">Job: {selectedRecord.job}</Typography>
        </Paper>
      ) : (
        <Typography variant="body1">
          Select a record to see the details.
        </Typography>
      )}
    </Box>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
