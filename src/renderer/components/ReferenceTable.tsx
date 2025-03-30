import React from 'react';
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
} from '@mui/material';
import Library from '../../main/model/Library';

interface ReferenceTableProps {
  selectedRecord: Library | null;
  onRemoveLibrary: (library: Library) => void; // Callback for deleting the library
}

function ReferenceTable({
  selectedRecord,
  onRemoveLibrary,
}: ReferenceTableProps) {
  const handleRemove = () => {
    if (selectedRecord) {
      onRemoveLibrary(selectedRecord);
    }
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
        {selectedRecord && (
          <Button
            variant="contained"
            color="error"
            onClick={handleRemove}
            sx={{ marginLeft: 'auto' }}
          >
            Remove Library
          </Button>
        )}
      </Box>

      {selectedRecord ? (
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
              {selectedRecord.references.map((row) => (
                <TableRow
                  key={row.key}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.08)', // Light gray hover effect
                      cursor: 'pointer', // Change cursor to pointer on hover
                    },
                  }}
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
    </Box>
  );
}

export default ReferenceTable;
