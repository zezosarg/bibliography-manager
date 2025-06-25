import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState, useEffect } from 'react';
import { Alert, Box, CssBaseline, Snackbar } from '@mui/material';
import { ILibrary } from '../types/ILibrary';
import Sidebar from './components/Sidebar';
import ReferenceTable from './components/ReferenceTable';
import Header from './components/Header';

function Home() {
  const [selectedLibrary, setSelectedLibrary] = useState<ILibrary | null>(null);
  const [libraries, setLibraries] = useState<ILibrary[]>([]);
  const [selectedItem, setSelectedItem] = useState<ILibrary | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleRecordClick = (record: ILibrary) => {
    setSelectedLibrary(record);
  };

  const handleRemoveLibrary = (library: ILibrary) => {
    setLibraries((prevLibraries) =>
      prevLibraries.filter((lib) => lib !== library),
    );
    setSelectedLibrary(null);
    window.electron.ipcRenderer.sendMessage('remove-library', library); // TODO check if success
  };

  const loadLibraries = async () => {
    try {
      const loadedLibraries =
        await window.electron.ipcRenderer.invoke('load-libraries');
      setLibraries(loadedLibraries);
      if (loadedLibraries.length > 0) {
        setSelectedLibrary(loadedLibraries[0]);
        setSelectedItem(loadedLibraries[0]);
      }
    } catch (error) {
      setSnackbarMessage('Failed to load libraries');
      setSnackbarOpen(true);
    }
  };

  const handleEditLibrary = (library: ILibrary) => {
    // try {
    // const writeResult = window.electron.ipcRenderer.invoke(
    //   'write-library',
    //   library,
    // );
    // if (!writeResult) throw new Error(`Failed to write library`);
    // setLibraries((prevLibraries) =>
    //   prevLibraries.map((lib) => (lib.name === library.name ? library : lib)),
    // );
    loadLibraries();
    setSelectedLibrary(library);
    setSelectedItem(library);
    setSnackbarMessage('Library edited successfully');
    setSnackbarOpen(true);
    // } catch (error) {
    //   setSnackbarMessage('Failed to edit library');
    //   setSnackbarOpen(true);
    //   throw error;
    // }
  };

  const handleSearch = async (query: string, searchField: string) => {
    const filteredLibrary = await window.electron.ipcRenderer.invoke(
      'search-libraries',
      query,
      searchField,
      libraries,
    );
    if (!filteredLibrary) {
      // setSnackbarMessage('No results found');
      // setSnackbarOpen(true);
      return;
    }
    setSelectedLibrary(filteredLibrary);
    setSelectedItem(null);
  };

  const handleLibraryData = (...args: unknown[]) => {
    const library = args[0] as ILibrary;
    setLibraries((prevLibraries) => {
      const libraryExists = prevLibraries.some(
        (lib) => lib.name === library.name || lib.filePath === library.filePath,
      );
      if (libraryExists) {
        setSnackbarMessage(`Library ${library.name} overwritten`);
        setSnackbarOpen(true);
        return prevLibraries.map((lib) =>
          lib.name === library.name || lib.filePath === library.filePath
            ? library
            : lib,
        );
      }
      return [...prevLibraries, library];
    });
    setSelectedLibrary(library);
    setSelectedItem(library);
  };

  const handleFindDuplicates = async () => {
    if (!selectedLibrary) {
      setSnackbarMessage('No library selected. Please select a library first.');
      setSnackbarOpen(true);
      return;
    }
    const duplicateLibrary = await window.electron.ipcRenderer.invoke(
      'find-duplicates',
      selectedLibrary,
    );
    if (!duplicateLibrary || duplicateLibrary.references.length === 0) {
      setSnackbarMessage('No duplicates found');
      setSnackbarOpen(true);
    } else {
      setSelectedItem(null);
      setSelectedLibrary(duplicateLibrary);
      setSnackbarMessage('Duplicates found and loaded');
      setSnackbarOpen(true);
    }
  };

  const handleExport = async (action: string) => {
    if (!selectedLibrary) {
      setSnackbarMessage('No library selected. Please select a library first.');
      setSnackbarOpen(true);
      return;
    }
    const copyResult = await window.electron.ipcRenderer.invoke(
      'export-formatted',
      selectedLibrary,
      action,
    );
    if (!copyResult) {
      setSnackbarMessage('Failed to export library');
      setSnackbarOpen(true);
      return;
    }
    setSnackbarMessage(`Library copied to clipboard as ${action}`);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    loadLibraries();
    window.electron.ipcRenderer.on('open-library', handleLibraryData);
    return () => {
      // window.electron.ipcRenderer.removeListener('open-library', handleLibraryData);
    };
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header
        onSearch={handleSearch}
        onFindDuplicates={handleFindDuplicates}
        onHandleExport={handleExport}
      />
      <Sidebar
        onRecordClick={handleRecordClick}
        libraries={libraries}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
      <ReferenceTable
        selectedLibrary={selectedLibrary}
        onRemoveLibrary={handleRemoveLibrary}
        onEditLibrary={handleEditLibrary}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Automatically hide after 3 seconds
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
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
