import React, { useState } from 'react';
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Typography,
} from '@mui/material';
import Library from '../../main/model/Library';
import Reference from '../../main/model/Reference';
import ReferenceModal from './ReferenceModal';

interface ReferenceTableProps {
  selectedLibrary: Library | null;
  onRemoveLibrary: (library: Library) => void;
  onEditLibrary: (library: Library) => void;
  // duplicates: Reference[][] | null; // Optional prop for duplicates
}

function ReferenceTable({
  selectedLibrary,
  onRemoveLibrary,
  onEditLibrary,
  // duplicates,
}: ReferenceTableProps) {
  const [openReferenceModal, setOpenReferenceModal] = useState(false);
  const [selectedReference, setSelectedReference] = useState<Reference | null>(
    null,
  );
  const [showAddReferencesMessage, setShowAddReferencesMessage] =
    useState(false);
  const [libraryToAddRefs, setLibraryToAddRefs] = useState<Library | null>(
    null,
  );
  const [selectedReferences, setSelectedReferences] = useState<Set<Reference>>(
    new Set(),
  );

  const handleRemoveLibrary = () => {
    if (selectedLibrary) {
      onRemoveLibrary(selectedLibrary);
    }
  };

  const handleRowClick = (row: Reference) => {
    if (showAddReferencesMessage) {
      // Toggle selection
      setSelectedReferences((prevSelected) => {
        const newSelected = new Set(prevSelected);
        if (newSelected.has(row)) {
          newSelected.delete(row);
        } else {
          newSelected.add(row);
        }
        return newSelected;
      });
    } else {
      // Default behavior: open modal
      const reference = Object.assign(new Reference(), row); // Rehydrate the reference
      setSelectedReference(reference);
      setOpenReferenceModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenReferenceModal(false);
    setSelectedReference(null);
  };

  const handleSaveReference = (updatedReference: Reference) => {
    if (updatedReference.key === 'unauthoredundateduntitled') {
      updatedReference.key = updatedReference.generateKey();
    }
    if (selectedLibrary) {
      const referenceExists = selectedLibrary.references.some(
        (ref) => ref.key === updatedReference.key,
      );
      if (!referenceExists) {
        selectedLibrary.references.push(updatedReference);
      }
      const updatedReferences = selectedLibrary.references.map((ref) =>
        ref.key === updatedReference.key ? updatedReference : ref,
      );
      const updatedLibrary = new Library(
        selectedLibrary.filePath,
        selectedLibrary.name,
        updatedReferences,
      );
      onEditLibrary(updatedLibrary);
    }
    handleCloseModal();
  };

  const handleDeleteReference = () => {
    if (selectedLibrary) {
      const updatedReferences = selectedLibrary.references.filter(
        (ref) => ref.key !== selectedReference?.key,
      );
      const updatedLibrary = new Library(
        selectedLibrary.filePath,
        selectedLibrary.name,
        updatedReferences,
      );
      onEditLibrary(updatedLibrary);
    }
    handleCloseModal();
  };

  const handleNewReference = () => {
    const newReference = new Reference();
    setSelectedReference(newReference);
    setOpenReferenceModal(true);
  };

  const handleOpenFile = (filePath: string | undefined) => {
    if (filePath) {
      window.electron.ipcRenderer.sendMessage('open-file', filePath);
    }
  };

  const handleAddReferences = () => {
    setShowAddReferencesMessage(true);
    setLibraryToAddRefs(selectedLibrary);
  };

  const handleCancel = () => {
    setShowAddReferencesMessage(false);
    setLibraryToAddRefs(null);
    setSelectedReferences(new Set());
  };

  const handleAddSelected = () => {
    if (libraryToAddRefs) {
      const selectedRefs = Array.from(selectedReferences);

      const updatedReferences = [
        ...libraryToAddRefs.references,
        ...selectedRefs.filter(
          (ref) =>
            !libraryToAddRefs.references.some(
              (existingRef) => existingRef.key === ref.key,
            ),
        ),
      ];

      const updatedLibrary = new Library(
        libraryToAddRefs.filePath,
        libraryToAddRefs.name,
        updatedReferences,
      );

      onEditLibrary(updatedLibrary);
      setSelectedReferences(new Set());
      setShowAddReferencesMessage(false); // Exit add references mode
      setLibraryToAddRefs(null);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        p: 2,
        marginLeft: 0,
        marginTop: 5, // Offset for the top bar height
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between', // Space between the title and the button
          alignItems: 'center',
          marginBottom: 0,
        }}
      >
        <h2>References</h2>
        {showAddReferencesMessage && selectedLibrary && (
          <Box
            sx={{
              backgroundColor: 'var(--highlight-color)',
              padding: 1,
              borderRadius: 2, // Slightly rounded corners
              textAlign: 'center',
            }}
          >
            <Typography>
              Select References to Add to{' '}
              <strong>{libraryToAddRefs?.name || 'Unknown Library'}</strong> (
              {selectedReferences.size} selected)
            </Typography>
          </Box>
        )}
        {selectedLibrary && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!showAddReferencesMessage && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddReferences}
                  sx={{ marginLeft: 'auto' }}
                >
                  Add References
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNewReference}
                >
                  New Reference
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={handleRemoveLibrary}
                  sx={{ marginLeft: 'auto' }}
                >
                  Remove Library
                </Button>
              </>
            )}
            {showAddReferencesMessage && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddSelected}
                >
                  Add Selected
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={handleCancel}
                  sx={{ marginLeft: 'auto' }}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        )}
      </Box>

      {selectedLibrary ? (
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: '80vh', // Set a maximum height for the table container
            overflowY: 'auto', // Enable vertical scrolling
          }}
        >
          <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Journal</TableCell>
                <TableCell>Volume</TableCell>
                <TableCell>Number</TableCell>
                <TableCell>Pages</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Publisher</TableCell>
                <TableCell>ISSN</TableCell>
                {/* <TableCell>DOI</TableCell> */}
                <TableCell>URL</TableCell>
                {/* <TableCell>Keywords</TableCell> */}
                {/* <TableCell>Abstract</TableCell> */}
                <TableCell>File</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedLibrary.references.map((row) => (
                <TableRow
                  key={row.key}
                  sx={{
                    backgroundColor:
                      showAddReferencesMessage &&
                      row.key &&
                      selectedReferences.has(row)
                        ? 'var(--highlight-color)' // Highlight selected rows
                        : 'inherit',
                    // '& td': {
                    //   fontWeight: (() => {
                    //     const groupIndex = duplicates?.findIndex((group) =>
                    //       group.includes(row),
                    //     );
                    //     return groupIndex !== undefined && groupIndex % 2 === 0
                    //       ? 'bold' // Make font bold for even-indexed groups (1-based: 2nd, 4th, etc.)
                    //       : 'inherit'; // Default font weight
                    //   })(),
                    // },
                    '&:hover': {
                      backgroundColor: 'var(--hover-color)',
                      cursor: 'pointer', // Change cursor to pointer on hover
                    },
                  }}
                  onClick={() => handleRowClick(row)}
                >
                  <TableCell>{row.entryType}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.author}</TableCell>
                  <TableCell>{row.journal}</TableCell>
                  <TableCell>{row.volume}</TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.pages}</TableCell>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>{row.publisher}</TableCell>
                  <TableCell>{row.issn}</TableCell>
                  {/* <TableCell>{row.doi}</TableCell> */}
                  {/* <TableCell>{row.url}</TableCell> */}
                  <TableCell>
                    {row.url ? (
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'underline', color: 'blue' }}
                        onClick={(e) => e.stopPropagation()} // Prevent triggering row click
                      >
                        Link
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  {/* <TableCell>{row.keywords}</TableCell> */}
                  {/* <TableCell>{row.abstract}</TableCell> */}
                  <TableCell>
                    {row.linkedFilePath ? (
                      <Button
                        variant="text"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering row click
                          handleOpenFile(row.linkedFilePath);
                        }}
                      >
                        {row.linkedFilePath.split('.').pop()}{' '}
                      </Button>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            marginTop: 2,
            color: 'rgba(0, 0, 0, 0.6)',
          }}
        >
          Select a Library or Search References
        </Typography>
      )}

      <ReferenceModal
        open={openReferenceModal}
        reference={selectedReference}
        onClose={handleCloseModal}
        onSave={handleSaveReference}
        onDelete={handleDeleteReference}
      />
    </Box>
  );
}

export default ReferenceTable;
