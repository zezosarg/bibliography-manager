import React from 'react';
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
  onSave: () => void;
  onDelete: () => void;
}

function ReferenceModal({
  open,
  reference,
  onClose,
  onSave,
  onDelete,
}: ReferenceModalProps) {
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
          value={reference?.toBibTeXString() || ''}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReferenceModal;
