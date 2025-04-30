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
import Library from '../../main/model/Library';

interface ReferenceModalProps {
  open: boolean;
  reference: Reference | null;
  onClose: () => void;
  onSave: (updatedReference: Reference) => void;
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
    if (reference) {
      // const updatedReference = Reference.parseBibTeXString(bibTeXString);
      const lib = Library.parseString(bibTeXString, 'lib.bib');
      const updatedReference = lib.references[0];
      onSave(updatedReference);
    }
  };

  const handleLinkFile = async () => {
    if (!reference) return;

    const { filePaths, canceled } =
      await window.electron.ipcRenderer.invoke('open-file-dialog');

    if (!canceled && filePaths.length > 0) {
      const linkedFilePath = filePaths[0];
      reference.linkedFilePath = linkedFilePath;
      onSave(reference);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Edit Reference</span>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              // startIcon={<DeleteIcon />}
              onClick={handleLinkFile}
            >
              Link File
            </Button>
            <Button
              variant="contained"
              color="inherit"
              // startIcon={<DeleteIcon />}
              onClick={onDelete}
            >
              Delete
            </Button>
          </Box>
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
