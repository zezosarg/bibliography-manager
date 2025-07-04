// Library class to represent a collection of BibTeX references
import path from 'path';
import Reference from './Reference';
import { ILibrary } from '../../types/ILibrary';

export default class Library implements ILibrary {
  name: string;

  references: Reference[];

  filePath: string;

  constructor(filePath: string, name?: string, references: Reference[] = []) {
    this.name = name || path.basename(filePath);
    this.references = references;
    this.filePath = filePath;
  }

  static from(data: ILibrary): Library {
    const references = data.references.map((ref) => {
      return Reference.from(ref);
    });
    const lib = new Library(data.filePath, data.name, references);
    lib.references.forEach((ref) => {
      ref.library = lib;
    });
    return lib;
  }

  listReferences(): string {
    return this.references.map((ref) => ref.toBibTeXString()).join('\n\n');
  }

  toHtmlString(): string {
    return this.references
      .map((ref) => {
        const html = ref.toHtmlString();
        return `<div class="csl-bib-body">${html}</div>`;
      })
      .join('\n');
  }
}
