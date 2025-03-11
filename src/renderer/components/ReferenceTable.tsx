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
} from '@mui/material';

const rows = [
  { id: 1, name: 'John Doe', age: 28, profession: 'Engineer' },
  { id: 2, name: 'Jane Smith', age: 34, profession: 'Designer' },
  { id: 3, name: 'Alice Johnson', age: 25, profession: 'Developer' },
  { id: 4, name: 'Bob Brown', age: 40, profession: 'Manager' },
];

function ReferenceTable() {
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
      <h1>Main Content Area</h1>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Profession</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.profession}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ReferenceTable;
