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
    setBibTeXString(reference?.toBibTeXString() || '');
  }, [reference]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBibTeXString(event.target.value);
  };

  const detectFileType = (fileContent: string) => {
    const trimmedContent = fileContent.trim();

    if (trimmedContent.startsWith('@')) {
      return 'lib.bib'; // BibTeX files start with '@'
    }
    if (trimmedContent.startsWith('TY')) {
      return 'lib.ris'; // RIS files always start with the 'TY' tag
    }
    if (
      trimmedContent.startsWith('PMID') ||
      trimmedContent.startsWith('TI') ||
      trimmedContent.startsWith('FAU')
    ) {
      return 'lib.nbib'; // NBIB files may start with 'PMID', 'TI', or 'FAU'
    }
    throw new Error('Unable to detect file type from content');
  };

  const handleSave = () => {
    if (reference) {
      const referenceId = reference.id;
      const fileType = detectFileType(bibTeXString);
      const lib = Library.parseString(bibTeXString, fileType);
      const updatedReference = lib.references[0];
      updatedReference.id = referenceId;
      onSave(updatedReference);

      // Merge original reference properties to preserve any missing fields?
      // const mergedReference = { ...reference, ...updatedReference };
      // onSave(mergedReference);
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
