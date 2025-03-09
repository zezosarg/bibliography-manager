import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
import './App.css';
import { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Paper,
  Typography,
  AppBar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
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

  const rows = [
    { id: 1, name: 'John Doe', age: 28, profession: 'Engineer' },
    { id: 2, name: 'Jane Smith', age: 34, profession: 'Designer' },
    { id: 3, name: 'Alice Johnson', age: 25, profession: 'Developer' },
    { id: 4, name: 'Bob Brown', age: 40, profession: 'Manager' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Application
          </Typography>
        </Toolbar>
      </AppBar>

      <Sidebar onRecordClick={handleRecordClick} />

      {/* {selectedRecord ? (
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
      )} */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          marginLeft: 0, // Adjust the content to be next to the sidebar
          marginTop: 5, // Offset for the top bar height
        }}
      >
        <h1>Main Content Area</h1>

        {/* Table Component */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Profession</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.profession}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
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
