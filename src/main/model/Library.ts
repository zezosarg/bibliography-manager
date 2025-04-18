// Library class to represent a collection of BibTeX references
import path from 'path';
import Reference from './Reference';

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
}
