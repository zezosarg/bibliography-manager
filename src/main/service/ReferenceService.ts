import Reference from '../model/Reference';
import Library from '../model/Library';
import { openFileDialog } from '../util';
import getParser from '../parser/ParserFactory';

export function saveReference(
  updatedReference: Reference,
  selectedLibrary: Library,
): Library {
  const referenceExists = selectedLibrary.references.some(
    (ref) => ref.id === updatedReference.id,
  );
  if (!referenceExists) {
    selectedLibrary.references.push(updatedReference);
  }
  const updatedReferences = selectedLibrary.references.map((ref) =>
    ref.id === updatedReference.id ? updatedReference : ref,
  );
  selectedLibrary.references = updatedReferences;
  return selectedLibrary;
}

export function deleteReference(
  selectedReference: Reference,
  selectedLibrary: Library,
): Library {
  const updatedReferences = selectedLibrary.references.filter(
    (ref) => ref.id !== selectedReference?.id,
  );
  selectedLibrary.references = updatedReferences;
  return selectedLibrary;
}

export function createReference(): Reference {
  return new Reference();
}

export function addReferences(
  libraryToAddRefs: Library,
  selectedReferences: Reference[],
): Library {
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
