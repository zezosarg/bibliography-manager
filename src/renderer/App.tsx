import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
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
  const [selectedItem, setSelectedItem] = useState<Library | null>(null);

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
      if (prevLibraries.length === 0) {
        return [library];
      }
      return [...prevLibraries, library];
    });
    // setSelectedLibrary(library); // Select the last library
  };

  const loadLibraries = async () => {
    try {
      const loadedLibraries =
        await window.electron.ipcRenderer.invoke('load-libraries');
      setLibraries(loadedLibraries);
    } catch (error) {
      console.error('Failed to load libraries:', error);
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
      <Header onSearch={handleSearch} />
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
