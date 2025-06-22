import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { IReference } from '../../types/IReference';

interface ReferenceModalProps {
  open: boolean;
  reference: IReference | null;
  onClose: () => void;
  onSave: (updatedReference: IReference) => void;
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
    const fetchConvertedRef = async () => {
      const convertedRef = await window.electron.ipcRenderer.invoke(
        'convert-reference',
        reference,
      );
      setBibTeXString(convertedRef);
    };
    if (reference) {
      fetchConvertedRef();
    }
  }, [reference]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBibTeXString(event.target.value);
  };

  const handleSave = async () => {
    if (!reference) return;
    const updatedReference = await window.electron.ipcRenderer.invoke(
      'update-reference',
      reference,
      bibTeXString,
    );
    onSave(updatedReference);
  };

  const handleLinkFile = async () => {
    if (!reference) return;
    const linkedRef = await window.electron.ipcRenderer.invoke(
      'link-file',
      reference,
    );
    onSave(linkedRef);
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
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              marginTop: 2,
              color: 'var(--help-color)',
            }}
          >
            You can paste BibTeX, RIS, or NBIB formatted references here.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" color="info" onClick={handleLinkFile}>
              Link File
            </Button>
            <Button variant="contained" color="inherit" onClick={onDelete}>
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
        <Button onClick={onClose} color="info">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="info">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReferenceModal;
