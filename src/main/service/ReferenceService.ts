import Reference from '../model/Reference';
import Library from '../model/Library';
import { openFileDialog } from '../util';
import getParser from '../parser/ParserFactory';
// import { writeLibrary } from './LibraryService';

export function saveReference(updatedReference: Reference): Library {
  if (updatedReference.library) {
    const referenceExists = updatedReference.library.references.some(
      (ref) => ref.id === updatedReference.id,
    );
    if (!referenceExists) {
      updatedReference.library.references.push(updatedReference);
    }
    const updatedReferences = updatedReference.library.references.map((ref) =>
      ref.id === updatedReference.id ? updatedReference : ref,
    );
    updatedReference.library.references = updatedReferences;
    // writeLibrary(selectedLibrary); // TODO error handling
    return updatedReference.library;
  }
  throw new Error('Reference does not belong to any library');
}

export function deleteReference(selectedReference: Reference): Library {
  if (selectedReference.library) {
    const updatedReferences = selectedReference.library?.references.filter(
      (ref) => ref.id !== selectedReference?.id,
    );
    selectedReference.library.references = updatedReferences || [];
    // writeLibrary(selectedLibrary); // TODO error handling
    return selectedReference.library;
  }
  throw new Error('Reference does not belong to any library');
}

export function createReference(selectedLibrary: Library): Reference {
  return new Reference(selectedLibrary);
}

export function addReferences(
  libraryToAddRefs: Library,
  selectedReferences: Reference[],
): Library {
  selectedReferences.forEach((ref) => {
    ref.library = libraryToAddRefs;
  });
  const updatedReferences = [
    ...libraryToAddRefs.references,
    ...selectedReferences.filter(
      (ref) =>
        !libraryToAddRefs.references.some(
          (existingRef) => existingRef.id === ref.id,
        ),
    ),
  ];
  libraryToAddRefs.references = updatedReferences;
  // writeLibrary(libraryToAddRefs); // TODO error handling
  return libraryToAddRefs;
}

export function convertReference(reference: Reference): String {
  if (!reference) return '';
  return reference.toBibTeXString();
}

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

export function updateReference(
  reference: Reference,
  bibTeXString: string,
): Reference {
  if (!reference) throw new Error('Reference cannot be null or undefined');
  const fileType = detectFileType(bibTeXString);
  const parser = getParser(fileType);
  const parsedLibrary = parser.parse(bibTeXString, fileType);
  const updatedReference = parsedLibrary.references[0];
  updatedReference.metadata = reference.metadata; // Preserve original metadata
  updatedReference.id = reference.id;
  return updatedReference;
}

export async function linkFile(reference: Reference): Promise<Reference> {
  if (!reference) throw new Error('No reference to link file to');
  const { filePaths, canceled } = await openFileDialog(['pdf']);
  if (!canceled && filePaths.length > 0) {
    const linkedFilePath = filePaths[0];
    reference.linkedFilePath = linkedFilePath;
  }
  return reference;
}
