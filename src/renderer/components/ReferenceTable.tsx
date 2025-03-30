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
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Dialog,
} from '@mui/material';
import Library from '../../main/model/Library';
import Reference from '../../main/model/Reference';

interface ReferenceTableProps {
  selectedLibrary: Library | null;
  onRemoveLibrary: (library: Library) => void; // Callback for deleting the library
}

function ReferenceTable({
  selectedLibrary,
  onRemoveLibrary,
}: ReferenceTableProps) {
  const [openReferenceModal, setOpenReferenceModal] = useState(false);
  const [selectedReference, setSelectedReference] = useState<Reference | null>(
    null,
  );

  const handleRemoveLibrary = () => {
    if (selectedLibrary) {
      onRemoveLibrary(selectedLibrary);
    }
  };

  const handleRowClick = (row: Reference) => {
    const reference = new Reference(
      row.key,
      row.entryType,
      row.title,
      row.author,
      row.journal,
      row.volume,
      row.number,
      row.pages,
      row.year,
      row.publisher,
    ); // to avoid 'TypeError selectedReference?.toBibTeXString is not a function'
    setSelectedReference(reference);
    setOpenReferenceModal(true);
  };

  const handleCloseModal = () => {
    setOpenReferenceModal(false);
    setSelectedReference(null);
  };

  const handleSaveReference = () => {
    // Logic to save the edited .bib content
    // console.log('Saved .bib content:', bibContent);
    handleCloseModal();
  };

  const handleDeleteReference = () => {
    // Logic to delete the reference
    console.log('Deleted Reference:', selectedReference);
    handleCloseModal();
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        p: 3,
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
          marginBottom: 2, // Add some spacing below the container
        }}
      >
        <h1>References</h1>
        {selectedLibrary && (
          <Button
            variant="contained"
            color="error"
            onClick={handleRemoveLibrary}
            sx={{ marginLeft: 'auto' }}
          >
            Remove Library
          </Button>
        )}
      </Box>

      {selectedLibrary ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedLibrary.references.map((row) => (
                <TableRow
                  key={row.key}
                  sx={{
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>Select a Library</p>
      )}

      {/* Modal for editing the row */}
      <Dialog
        open={openReferenceModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
      >
        {/* <DialogTitle>Edit Reference</DialogTitle> */}
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Edit Reference</span>
            <Button
              variant="contained"
              color="error"
              // startIcon={<DeleteIcon />}
              onClick={handleDeleteReference}
            >
              Delete Reference
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            rows={15}
            value={selectedReference?.toBibTeXString()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveReference}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ReferenceTable;
