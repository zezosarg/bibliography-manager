import { clipboard } from 'electron';
import fs from 'fs';
import Library from '../model/Library';
import Reference from '../model/Reference';

export async function writeLibrary(library: Library): Promise<boolean> {
  const bibContent = library.listReferences();
  try {
    fs.writeFileSync(library.filePath, bibContent, 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving library:', error);
    return false;
  }
}

export function searchReferences(
  query: string,
  searchField: string,
  libraries: Library[],
): Library | undefined {
  if (!query) {
    return undefined;
  }
  const lowerCaseQuery = query.toLowerCase();
  const allRefs = libraries.flatMap((library) => library.references);
  const filteredRefs = allRefs.filter(
    (ref) =>
      (ref.title?.toLowerCase().includes(lowerCaseQuery) &&
        (searchField === 'all' || searchField === 'title')) ||
      (ref.author?.toLowerCase().includes(lowerCaseQuery) &&
        (searchField === 'all' || searchField === 'author')) ||
      (ref.journal?.toLowerCase().includes(lowerCaseQuery) &&
        (searchField === 'all' || searchField === 'journal')) ||
      (ref.year?.toString().includes(lowerCaseQuery) &&
        (searchField === 'all' || searchField === 'year')) ||
      (ref.volume?.toString().includes(lowerCaseQuery) &&
        (searchField === 'all' || searchField === 'volume')) ||
      (ref.number?.toString().includes(lowerCaseQuery) &&
        (searchField === 'all' || searchField === 'number')) ||
      (ref.pages?.toString().includes(lowerCaseQuery) &&
        (searchField === 'all' || searchField === 'pages')) ||
      (ref.publisher?.toLowerCase().includes(lowerCaseQuery) &&
        (searchField === 'all' || searchField === 'publisher')) ||
      (ref.key?.toLowerCase().includes(lowerCaseQuery) &&
        (searchField === 'all' || searchField === 'key')),
  );
  if (filteredRefs.length === 0) {
    // console.log('No results found');
    return undefined;
  }
  const filteredLibrary = new Library(
    'Search Lib Path',
    'Search Lib Name',
    filteredRefs,
  );
  return filteredLibrary;
}

export function findDuplicates(selectedLibrary: Library): Library | undefined {
  const { references } = selectedLibrary;
  const seen = new Map<string, Reference[]>();
  const duplicateGroups: Reference[][] = [];
  references.forEach((ref) => {
    const key = `${ref.title?.toLowerCase() || ''}-${ref.author?.toLowerCase() || ''}-${ref.year || ''}`;
    if (seen.has(key)) {
      seen.get(key)?.push(ref);
    } else {
      seen.set(key, [ref]);
    }
  });
  seen.forEach((group) => {
    if (group.length > 1) {
      duplicateGroups.push(group);
    }
  });
  const duplicateLibrary = new Library(
    'Duplicates',
    'Duplicate References',
    duplicateGroups.flat(),
  );
  return duplicateLibrary;
}

export function exportFormatted(
  library: Library,
  format: 'bib' | 'html',
): string {
  let exportText = '';
  switch (format) {
    case 'bib':
      exportText = library.listReferences();
      break;
    case 'html':
      exportText = library.toHtmlString();
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
  clipboard.writeText(exportText);
  return exportText;
}
