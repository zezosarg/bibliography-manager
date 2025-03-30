import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
import Reference from '../../main/model/Reference';

interface ReferenceModalProps {
  open: boolean;
  reference: Reference | null;
  onClose: () => void;
  onSave: (updatedReference: string) => void;
  onDelete: () => void;
}

function ReferenceModal({
  open,
  reference,
  onClose,
  onSave,
  onDelete,
}: ReferenceModalProps) {
  const [bibTeXString, setBibTeXString] = useState('');

  useEffect(() => {
    // Update the state when the reference prop changes
    setBibTeXString(reference?.toBibTeXString() || '');
  }, [reference]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBibTeXString(event.target.value);
  };

  const handleSave = () => {
    onSave(bibTeXString);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
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
            onClick={onDelete}
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
          value={bibTeXString}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReferenceModal;
