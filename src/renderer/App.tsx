import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './components/Sidebar';
import ReferenceTable from './components/ReferenceTable';
import Header from './components/Header';
import Library from '../main/model/Library';

function Home() {
  const [selectedRecord, setSelectedRecord] = useState<Library | null>(null);
  const [libraries, setLibraries] = useState<Library[]>([]);

  const handleRecordClick = (record: Library) => {
    setSelectedRecord(record);
  };

  const handleRemoveLibrary = (library: Library) => {
    setLibraries((prevLibraries) =>
      prevLibraries.filter((lib) => lib !== library),
    );
    setSelectedRecord(null);
  };

  useEffect(() => {
    const handleLibraryData = (...args: unknown[]) => {
      const library = args[0] as Library;
      // console.log('Received data:', library);
      setLibraries((prevLibraries) => {
        if (prevLibraries.length === 0) {
          return [library];
        }
        return [...prevLibraries, library];
      });
      // setSelectedRecord(library); // Select the last library
    };
    window.electron.ipcRenderer.on('ipc-example', handleLibraryData);
    return () => {
      // window.electron.ipcRenderer.removeListener('ipc-example', handleLibraryData);
    };
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header />
      <Sidebar onRecordClick={handleRecordClick} libraries={libraries} />
      <ReferenceTable
        selectedRecord={selectedRecord}
        onRemoveLibrary={handleRemoveLibrary}
      />
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
