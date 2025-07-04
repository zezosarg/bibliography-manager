import React, { useState } from 'react';
import { Box } from '@mui/material';
import { ILibrary } from '../../types/ILibrary';
import { IReference } from '../../types/IReference';
import ReferenceModal from './ReferenceModal';
import ReferenceTableHeader from './ReferenceTableHeader';
import ReferenceTableBody from './ReferenceTableBody';

interface ReferenceTableProps {
  selectedLibrary: ILibrary | null;
  onRemoveLibrary: (library: ILibrary) => void;
  onEditLibrary: (library: ILibrary) => void;
  libraries: ILibrary[];
}

function ReferenceTable({
  selectedLibrary,
  onRemoveLibrary,
  onEditLibrary,
  libraries,
}: ReferenceTableProps) {
  const [openReferenceModal, setOpenReferenceModal] = useState(false);
  const [selectedReference, setSelectedReference] = useState<IReference | null>(
    null,
  );
  const [showAddReferencesMessage, setShowAddReferencesMessage] =
    useState(false);
  const [libraryToAddRefs, setLibraryToAddRefs] = useState<ILibrary | null>(
    null,
  );
  const [selectedReferences, setSelectedReferences] = useState<Set<IReference>>(
    new Set(),
  );

  const handleRemoveLibrary = () => {
    if (selectedLibrary) {
      onRemoveLibrary(selectedLibrary);
    }
  };

  const handleRowClick = (row: IReference) => {
    if (showAddReferencesMessage) {
      // Toggle selection
      setSelectedReferences((prevSelected) => {
        const newSelected = new Set(prevSelected);
        if (newSelected.has(row)) {
          newSelected.delete(row);
        } else {
          newSelected.add(row);
        }
        return newSelected;
      });
    } else {
      // Default behavior: open modal
      setSelectedReference(row);
      setOpenReferenceModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenReferenceModal(false);
    setSelectedReference(null);
  };

  const handleSaveReference = async (updatedReference: IReference) => {
    if (!selectedLibrary) return;
    // if (selectedLibrary == duplicates || selectedLibrary == search) ... find correct selectedLib
    const updatedLibrary = await window.electron.ipcRenderer.invoke(
      'save-reference',
      updatedReference,
    );
    onEditLibrary(updatedLibrary);
    handleCloseModal();
  };

  const handleDeleteReference = async () => {
    if (!selectedLibrary) return;
    // if (selectedLibrary == duplicates || selectedLibrary == search) ... find correct selectedLib
    const updatedLibrary = await window.electron.ipcRenderer.invoke(
      'delete-reference',
      selectedReference,
    );
    onEditLibrary(updatedLibrary);
    handleCloseModal();
  };

  const handleNewReference = async () => {
    const newReference = await window.electron.ipcRenderer.invoke(
      'create-reference',
      selectedLibrary,
    );
    setSelectedReference(newReference);
    setOpenReferenceModal(true);
  };

  const handleAddReferences = () => {
    setShowAddReferencesMessage(true);
    setLibraryToAddRefs(selectedLibrary);
  };

  const handleCancel = () => {
    setShowAddReferencesMessage(false);
    setLibraryToAddRefs(null);
    setSelectedReferences(new Set());
  };

  const handleAddSelected = async () => {
    if (!libraryToAddRefs) return;
    const updatedLibrary = await window.electron.ipcRenderer.invoke(
      'add-references',
      libraryToAddRefs,
      Array.from(selectedReferences),
    );
    onEditLibrary(updatedLibrary);
    setSelectedReferences(new Set());
    setShowAddReferencesMessage(false); // Exit add references mode
    setLibraryToAddRefs(null);
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        p: 2,
        marginLeft: 0,
        marginTop: 5, // Offset for the top bar height
        minHeight: '100vh',
      }}
    >
      <ReferenceTableHeader
        selectedLibrary={selectedLibrary}
        showAddReferencesMessage={showAddReferencesMessage}
        libraryToAddRefs={libraryToAddRefs}
        selectedReferencesCount={selectedReferences.size}
        handleAddReferences={handleAddReferences}
        handleNewReference={handleNewReference}
        handleRemoveLibrary={handleRemoveLibrary}
        handleAddSelected={handleAddSelected}
        handleCancel={handleCancel}
      />

      <ReferenceTableBody
        selectedLibrary={selectedLibrary}
        showAddReferencesMessage={showAddReferencesMessage}
        selectedReferences={selectedReferences}
        handleRowClick={handleRowClick}
      />

      <ReferenceModal
        open={openReferenceModal}
        reference={selectedReference}
        onClose={handleCloseModal}
        onSave={handleSaveReference}
        onDelete={handleDeleteReference}
      />
    </Box>
  );
}

export default ReferenceTable;
