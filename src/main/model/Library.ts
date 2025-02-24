import Reference from './Reference';
// Library class to represent a collection of BibTeX references
export default class Library {
  references: Reference[];

  constructor() {
    this.references = [];
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

// // Create an instance of the Library
// const library = new Library();

// // Create some BibTexReference instances
// const reference1 = new Reference(
//   'article',
//   'John Doe',
//   'An Important Paper',
//   2020,
//   'Some Journal',
//   undefined,
//   '1',
//   '1',
//   '10-20',
// );

// const reference2 = new Reference(
//   'book',
//   'Jane Smith',
//   'Advanced TypeScript',
//   2021,
//   undefined,
//   'Tech Publishers',
//   undefined,
//   undefined,
//   undefined,
// );

// // Add references to the library
// library.addReference(reference1);
// library.addReference(reference2);

// // Print the references in BibTeX format
// console.log(library.listReferences());
