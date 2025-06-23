import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ILibrary } from '../../types/ILibrary';

interface ReferenceTableHeaderProps {
  selectedLibrary: ILibrary | null;
  showAddReferencesMessage: boolean;
  libraryToAddRefs: ILibrary | null;
  selectedReferencesCount: number;
  handleAddReferences: () => void;
  handleNewReference: () => void;
  handleRemoveLibrary: () => void;
  handleAddSelected: () => void;
  handleCancel: () => void;
}

function ReferenceTableHeader({
  selectedLibrary,
  showAddReferencesMessage,
  libraryToAddRefs,
  selectedReferencesCount,
  handleAddReferences,
  handleNewReference,
  handleRemoveLibrary,
  handleAddSelected,
  handleCancel,
}: ReferenceTableHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
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
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography>
            Select References to Add to{' '}
            <strong>{libraryToAddRefs?.name || 'Unknown Library'}</strong> (
            {selectedReferencesCount} selected)
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
  );
}

export default ReferenceTableHeader;
