// Library class to represent a collection of BibTeX references
import path from 'path';
import Reference from './Reference';

const bibtexParse = require('bibtex-parse');

export default class Library {
  name: string;

  references: Reference[];

  filePath: string;

  constructor(filePath: string, references: Reference[] = []) {
    this.name = path.basename(filePath);
    this.references = references;
    this.filePath = filePath;
  }

  // Add a new BibTeX reference to the library
  addReference(reference: Reference): void {
    this.references.push(reference);
  }

  // Remove a reference from the library by its index
  removeReference(index: number): void {
    if (index >= 0 && index < this.references.length) {
      this.references.splice(index, 1);
    } else {
      console.error('Reference not found.');
    }
  }

  // Retrieve a reference by its index
  getReference(index: number): Reference | undefined {
    return this.references[index];
  }

  // List all references in BibTeX format
  listReferences(): string {
    return this.references.map((ref) => ref.toBibTeXString()).join('\n\n');
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
}
