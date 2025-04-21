// Library class to represent a collection of BibTeX references
import path from 'path';
import Reference from './Reference';

const bibtexParse = require('bibtex-parse');

export default class Library {
  name: string;

  references: Reference[];

  filePath: string;

  // linkedFilePath: string | null = null;

  constructor(filePath: string, references: Reference[] = []) {
    this.name = path.basename(filePath);
    this.references = references;
    this.filePath = filePath;
  }

  addReference(reference: Reference): void {
    this.references.push(reference);
  }

  removeReference(index: number): void {
    if (index >= 0 && index < this.references.length) {
      this.references.splice(index, 1);
    } else {
      console.error('Reference not found.');
    }
  }

  getReference(index: number): Reference | undefined {
    return this.references[index];
  }

  listReferences(): string {
    return this.references.map((ref) => ref.toBibTeXString()).join('\n\n');
  }

  static parseString(fileContent: string, filePath: string): Library {
    const fileExtension = path.extname(filePath).toLowerCase();

    if (fileExtension === '.bib') {
      return Library.parseBibTeXString(fileContent, filePath);
    }
    if (fileExtension === '.ris') {
      return Library.parseRisString(fileContent, filePath);
    }
    throw new Error(`Unsupported file format: ${fileExtension}`);
  }

  static parseBibTeXString(bibFile: string, filePath: string): Library {
    const bibData = bibtexParse.entries(bibFile);
    const library = new Library(filePath);
    bibData.forEach((entry: any) => {
      const reference = Object.assign(new Reference(), {
        key: entry.key,
        entryType: entry.type,
        title: entry.TITLE,
        author: entry.AUTHOR,
        journal: entry.JOURNAL,
        volume: entry.VOLUME,
        number: entry.NUMBER,
        pages: entry.PAGES,
        year: entry.YEAR,
        publisher: entry.PUBLISHER,
      });
      library.addReference(reference);
    });

    return library;
  }

  static parseRisString(risFile: string, filePath: string): Library {
    const lines = risFile.split(/\r?\n/);
    const library = new Library(filePath);
    let currentEntry: any = {};
    lines.forEach((line) => {
      const match = line.match(/^([A-Z0-9]{2}) {2}- (.+)$/);
      if (match) {
        const [_, key, value] = match;
        if (key === 'TY') {
          // Start of a new entry
          currentEntry = { entryType: value };
        } else if (key === 'A1') {
          // Handle multiple authors
          if (!currentEntry[key]) {
            currentEntry[key] = [];
          }
          currentEntry[key].push(value);
        } else {
          currentEntry[key] = value;
        }
      } else if (line.startsWith('ER')) {
        // End of the current entry
        const reference = Object.assign(new Reference(), {
          // key: currentEntry.ID || undefined,
          entryType: currentEntry.entryType,
          title: currentEntry.T1,
          author: currentEntry.A1 ? currentEntry.A1.join(', ') : '',
          journal: currentEntry.JO,
          volume: currentEntry.VL,
          number: currentEntry.IS,
          pages: currentEntry.SP,
          year: currentEntry.Y1 || currentEntry.PY,
          publisher: currentEntry.PB,
        });
        library.addReference(reference);
        currentEntry = {};
      }
    });
    return library;
  }
}
