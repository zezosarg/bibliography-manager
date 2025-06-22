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
import { ILibrary } from '../../types/ILibrary';
import { IReference } from '../../types/IReference';
import ReferenceModal from './ReferenceModal';

interface ReferenceTableProps {
  selectedLibrary: ILibrary | null;
  onRemoveLibrary: (library: ILibrary) => void;
  onEditLibrary: (library: ILibrary) => void;
}

function ReferenceTable({
  selectedLibrary,
  onRemoveLibrary,
  onEditLibrary,
}: ReferenceTableProps) {
  const [openReferenceModal, setOpenReferenceModal] = useState(false);
  const [selectedReference, setSelectedReference] = useState<IReference | null>(
    null,
  );
  const [showAddReferencesMessage, setShowAddReferencesMessage] =
    useState(false);
  const [libraryToAddRefs, setLibraryToAddRefs] = useState<ILibrary | null>(
    null,
  );
  const [selectedReferences, setSelectedReferences] = useState<Set<IReference>>(
    new Set(),
  );

  const handleRemoveLibrary = () => {
    if (selectedLibrary) {
      onRemoveLibrary(selectedLibrary);
    }
  };

  const handleRowClick = (row: IReference) => {
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
      // const reference = Object.assign(new IReference(), row); // Rehydrate the reference
      setSelectedReference(row);
      setOpenReferenceModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenReferenceModal(false);
    setSelectedReference(null);
  };

  const handleSaveReference = async (updatedReference: IReference) => {
    if (!selectedLibrary) return;
    const updatedLibrary = await window.electron.ipcRenderer.invoke(
      'save-reference',
      updatedReference,
      selectedLibrary,
    );
    onEditLibrary(updatedLibrary);
    handleCloseModal();
  };

  const handleDeleteReference = async () => {
    if (!selectedLibrary) return;
    const updatedLibrary = await window.electron.ipcRenderer.invoke(
      'delete-reference',
      selectedReference,
      selectedLibrary,
    );
    onEditLibrary(updatedLibrary);
    handleCloseModal();
  };

  const handleNewReference = async () => {
    const newReference =
      await window.electron.ipcRenderer.invoke('create-reference');
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

  const handleAddSelected = async () => {
    if (!libraryToAddRefs) return;
    const updatedLibrary = await window.electron.ipcRenderer.invoke(
      'add-references',
      libraryToAddRefs,
      Array.from(selectedReferences),
    );
    onEditLibrary(updatedLibrary);
    setSelectedReferences(new Set());
    setShowAddReferencesMessage(false); // Exit add references mode
    setLibraryToAddRefs(null);
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
                  color="info"
                  onClick={handleAddReferences}
                  sx={{ marginLeft: 'auto' }}
                >
                  Add References
                </Button>
                <Button
                  variant="contained"
                  color="info"
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
                  color="info"
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
                <TableCell>Key</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Journal</TableCell>
                <TableCell>Volume</TableCell>
                <TableCell>Number</TableCell>
                <TableCell>Pages</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Publisher</TableCell>
                <TableCell>DOI</TableCell>
                <TableCell>File</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedLibrary.references.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    backgroundColor:
                      showAddReferencesMessage &&
                      row.id &&
                      selectedReferences.has(row)
                        ? 'var(--highlight-color)' // Highlight selected rows
                        : 'inherit',
                    '&:hover': {
                      backgroundColor: 'var(--hover-color)',
                      cursor: 'pointer', // Change cursor to pointer on hover
                    },
                  }}
                  onClick={() => handleRowClick(row)}
                >
                  <TableCell>{row.key}</TableCell>
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
                    {row.doi ? (
                      <Button
                        variant="text"
                        color="info"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering row click
                          const doiUrl = (row.doi ?? '').startsWith(
                            'https://doi.org/',
                          )
                            ? row.doi
                            : `https://doi.org/${row.doi}`;
                          window.open(doiUrl, '_blank', 'noopener,noreferrer'); // Open the URL in a new tab
                        }}
                      >
                        WEB
                      </Button>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {row.linkedFilePath ? (
                      <Button
                        variant="text"
                        color="info"
                        size="small"
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
            color: 'var(--help-color)',
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
