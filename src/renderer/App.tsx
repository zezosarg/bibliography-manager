import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
import './App.css';
import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './components/Sidebar';
import ReferenceTable from './components/ReferenceTable';
import Header from './components/Header';

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
      <Header />
      <Sidebar onRecordClick={handleRecordClick} />
      <ReferenceTable selectedRecord={selectedRecord} />
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
