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
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [libraries, setLibraries] = useState<Library[]>([]);

  const handleRecordClick = (record: Library) => {
    setSelectedLibrary(record);
  };

  const handleRemoveLibrary = (library: Library) => {
    setLibraries((prevLibraries) =>
      prevLibraries.filter((lib) => lib !== library),
    );
    setSelectedLibrary(null);
  };

  const handleEditLibrary = (library: Library) => {
    try {
      window.electron.ipcRenderer.sendMessage('write-library', library);
      setLibraries((prevLibraries) =>
        prevLibraries.map((lib) =>
          lib.filePath === library.filePath ? library : lib,
        ),
      );
      setSelectedLibrary(library);
    } catch (error) {
      console.error('Failed to save library:', error);
      throw error;
    }
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
      // setSelectedLibrary(library); // Select the last library
    };
    window.electron.ipcRenderer.on('open-library', handleLibraryData);
    return () => {
      // window.electron.ipcRenderer.removeListener('open-library', handleLibraryData);
    };
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header />
      <Sidebar onRecordClick={handleRecordClick} libraries={libraries} />
      <ReferenceTable
        selectedLibrary={selectedLibrary}
        onRemoveLibrary={handleRemoveLibrary}
        onEditLibrary={handleEditLibrary}
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
