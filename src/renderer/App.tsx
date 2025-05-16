import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState, useEffect } from 'react';
import { Alert, Box, CssBaseline, Snackbar } from '@mui/material';
import Sidebar from './components/Sidebar';
import ReferenceTable from './components/ReferenceTable';
import Header from './components/Header';
import Library from '../main/model/Library';
import Reference from '../main/model/Reference';

function Home() {
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [selectedItem, setSelectedItem] = useState<Library | null>(null);
  // const [duplicates, setDuplicates] = useState<Reference[][]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleRecordClick = (record: Library) => {
    setSelectedLibrary(record);
  };

  const handleRemoveLibrary = (library: Library) => {
    setLibraries((prevLibraries) =>
      prevLibraries.filter((lib) => lib !== library),
    );
    setSelectedLibrary(null);
    window.electron.ipcRenderer.sendMessage('remove-library', library);
  };

  const handleEditLibrary = (library: Library) => {
    try {
      window.electron.ipcRenderer.sendMessage('write-library', library);
      setLibraries((prevLibraries) =>
        prevLibraries.map((lib) => (lib.name === library.name ? library : lib)),
      );
      setSelectedLibrary(library);
      setSelectedItem(library);
    } catch (error) {
      setSnackbarMessage('Failed to save library');
      setSnackbarOpen(true);
      console.error('Failed to save library:', error);
      throw error;
    }
  };

  const handleSearch = (query: string, searchField: string) => {
    if (!query) {
      return;
    }
    const lowerCaseQuery = query.toLowerCase();
    const allRefs = libraries.flatMap((library) => library.references);
    const filteredRefs = allRefs.filter(
      (ref) =>
        (ref.title?.toLowerCase().includes(lowerCaseQuery) &&
          (searchField === 'all' || searchField === 'title')) ||
        (ref.author?.toLowerCase().includes(lowerCaseQuery) &&
          (searchField === 'all' || searchField === 'author')) ||
        (ref.journal?.toLowerCase().includes(lowerCaseQuery) &&
          (searchField === 'all' || searchField === 'journal')) ||
        (ref.year?.toString().includes(lowerCaseQuery) &&
          (searchField === 'all' || searchField === 'year')) ||
        (ref.volume?.toString().includes(lowerCaseQuery) &&
          (searchField === 'all' || searchField === 'volume')) ||
        (ref.number?.toString().includes(lowerCaseQuery) &&
          (searchField === 'all' || searchField === 'number')) ||
        (ref.pages?.toString().includes(lowerCaseQuery) &&
          (searchField === 'all' || searchField === 'pages')) ||
        (ref.publisher?.toLowerCase().includes(lowerCaseQuery) &&
          (searchField === 'all' || searchField === 'publisher')) ||
        (ref.key?.toLowerCase().includes(lowerCaseQuery) &&
          (searchField === 'all' || searchField === 'key')),
    );
    if (filteredRefs.length === 0) {
      console.log('No results found');
      return;
    }
    const filteredLibrary = new Library(
      'Search Lib Path',
      'Search Lib Name',
      filteredRefs,
    );
    setSelectedLibrary(filteredLibrary);

    setSelectedItem(null);
  };

  const handleLibraryData = (...args: unknown[]) => {
    const library = args[0] as Library;

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
      console.error('Failed to load libraries:', error);
    }
  };

  const handleFindDuplicates = () => {
    // setDuplicates([]);

    if (!selectedLibrary) {
      setSnackbarMessage('No library selected. Please select a library first.');
      setSnackbarOpen(true);
      return;
    }

    const { references } = selectedLibrary;

    const seen = new Map<string, Reference[]>();
    const duplicateGroups: Reference[][] = [];

    references.forEach((ref) => {
      const key = `${ref.title?.toLowerCase() || ''}-${ref.author?.toLowerCase() || ''}-${ref.year || ''}`;
      if (seen.has(key)) {
        seen.get(key)?.push(ref);
      } else {
        seen.set(key, [ref]);
      }
    });

    seen.forEach((group) => {
      if (group.length > 1) {
        duplicateGroups.push(group);
      }
    });

    // setDuplicates(duplicateGroups);

    if (duplicateGroups.length === 0) {
      setSnackbarMessage('No duplicates found');
      setSnackbarOpen(true);
    } else {
      console.log('Duplicates found:', duplicateGroups);
      const duplicateLibrary = new Library(
        'Duplicates',
        'Duplicate References',
        duplicateGroups.flat(),
      );
      setSelectedItem(null);
      setSelectedLibrary(duplicateLibrary);
    }
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
      <Header onSearch={handleSearch} onFindDuplicates={handleFindDuplicates} />
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
        // duplicates={duplicates}
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
