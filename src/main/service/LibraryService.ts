import { clipboard } from 'electron';
import Library from '../model/Library';
import Reference from '../model/Reference';

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
    return undefined;
  }
  const filteredLibrary = new Library('Search', 'Search', filteredRefs);
  return filteredLibrary;
}

// Helper function to calculate string similarity using Levenshtein distance
function calculateSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;

  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  const matrix = Array(len2 + 1)
    .fill(null)
    .map(() => Array(len1 + 1).fill(null));

  for (let i = 0; i <= len1; i += 1) matrix[0][i] = i;
  for (let j = 0; j <= len2; j += 1) matrix[j][0] = j;

  for (let j = 1; j <= len2; j += 1) {
    for (let i = 1; i <= len1; i += 1) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1, // deletion
        matrix[j][i - 1] + 1, // insertion
        matrix[j - 1][i - 1] + cost, // substitution
      );
    }
  }

  const distance = matrix[len2][len1];
  const maxLen = Math.max(len1, len2);
  return (maxLen - distance) / maxLen;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

function areReferencesSimilar(
  ref1: Reference,
  ref2: Reference,
  threshold: number = 0.8,
): boolean {
  const title1 = normalizeText(ref1.title || '');
  const title2 = normalizeText(ref2.title || '');
  const author1 = normalizeText(ref1.author || '');
  const author2 = normalizeText(ref2.author || '');

  const titleSimilarity = calculateSimilarity(title1, title2);
  const authorSimilarity = calculateSimilarity(author1, author2);
  const yearMatch = ref1.year === ref2.year;

  // Consider similar if:
  // 1. High title similarity AND (author similarity OR same year)
  // 2. High author similarity AND same year AND moderate title similarity
  return (
    (titleSimilarity >= threshold && (authorSimilarity >= 0.7 || yearMatch)) ||
    (authorSimilarity >= threshold && yearMatch && titleSimilarity >= 0.6)
  );
}

export function findDuplicates(selectedLibrary: Library): Library | undefined {
  const { references } = selectedLibrary;
  const duplicateGroups: Reference[][] = [];
  const processed = new Set<number>();

  for (let i = 0; i < references.length; i += 1) {
    if (!processed.has(i)) {
      const currentGroup: Reference[] = [references[i]];
      processed.add(i);

      for (let j = i + 1; j < references.length; j += 1) {
        if (
          !processed.has(j) &&
          areReferencesSimilar(references[i], references[j])
        ) {
          currentGroup.push(references[j]);
          processed.add(j);
        }
      }

      if (currentGroup.length > 1) {
        duplicateGroups.push(currentGroup);
      }
    }
  }

  if (duplicateGroups.length === 0) {
    return undefined;
  }

  const duplicateLibrary = new Library(
    'Duplicates',
    'Duplicates',
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
