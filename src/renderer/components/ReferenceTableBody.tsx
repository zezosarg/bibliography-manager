import React from 'react';
import {
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

interface ReferenceTableBodyProps {
  selectedLibrary: ILibrary | null;
  showAddReferencesMessage: boolean;
  selectedReferences: Set<IReference>;
  handleRowClick: (row: IReference) => void;
}

function openDoiLink(e: React.MouseEvent, doi: string | undefined) {
  e.stopPropagation(); // Prevent triggering row click
  const doiUrl = (doi ?? '').startsWith('https://doi.org/')
    ? doi
    : `https://doi.org/${doi}`;
  window.open(doiUrl, '_blank', 'noopener,noreferrer'); // Open the URL in a new tab
}

function handleFileButtonClick(
  e: React.MouseEvent,
  filePath: string | undefined,
) {
  e.stopPropagation(); // Prevent triggering row click
  if (filePath) {
    window.electron.ipcRenderer.sendMessage('open-file', filePath);
  }
}

function ReferenceTableBody({
  selectedLibrary,
  showAddReferencesMessage,
  selectedReferences,
  handleRowClick,
}: ReferenceTableBodyProps) {
  if (!selectedLibrary) {
    return (
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
    );
  }

  return (
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
                    onClick={(e) => openDoiLink(e, row.doi)}
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
                    onClick={(e) =>
                      handleFileButtonClick(e, row.linkedFilePath)
                    }
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
  );
}

export default ReferenceTableBody;
