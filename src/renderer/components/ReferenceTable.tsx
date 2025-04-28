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
}

function ReferenceTable({
  selectedLibrary,
  onRemoveLibrary,
  onEditLibrary,
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
        updatedReferences,
      );

      onEditLibrary(updatedLibrary);
      setSelectedReferences(new Set()); // Clear selected references
      setShowAddReferencesMessage(false); // Exit add references mode
      setLibraryToAddRefs(null); // Clear the libraryToAddRefs
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        p: 2,
        marginLeft: 0, // Adjust the content to be next to the sidebar
        marginTop: 5, // Offset for the top bar height
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between', // Space between the title and the button
          alignItems: 'center', // Align items vertically in the center
          marginBottom: 0, // Add some spacing below the container
        }}
      >
        <h2>References</h2>
        {showAddReferencesMessage && selectedLibrary && (
          <Box
            sx={{
              backgroundColor: 'rgba(0, 123, 255, 0.1)', // Light blue background for better visibility
              padding: 1, // Add more padding for better spacing
              borderRadius: 2, // Slightly rounded corners
              // border: '1px solid rgba(0, 123, 255, 0.5)', // Add a border for emphasis
              textAlign: 'center', // Center the text inside the box
              // marginBottom: 2, // Add spacing below the box
            }}
          >
            <Typography
            // variant="body1"
            // sx={{ fontWeight: 'bold', color: 'rgba(0, 123, 255, 1)' }}
            >
              Select References to Add to{' '}
              <strong>{selectedLibrary.name}</strong>
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
                  color="secondary"
                  onClick={handleNewReference} // Open modal for adding a reference
                >
                  New Reference
                </Button>
                <Button
                  variant="contained"
                  color="error"
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
                  color="error"
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
                        ? 'rgba(0, 123, 255, 0.1)' // Highlight selected rows
                        : 'inherit',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.08)', // Light gray hover effect
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
        <p>Please Select a Library or Search References</p>
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
