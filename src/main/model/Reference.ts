// BibTexReference class to represent an individual BibTeX entry
export default class Reference {
  entryType: string; // Type of BibTeX entry (e.g., article, book)

  author: string;

  title: string;

  year: number;

  journal?: string;

  publisher?: string;

  volume?: string;

  number?: string;

  pages?: string;

  constructor(
    entryType: string,
    author: string,
    title: string,
    year: number,
    journal?: string,
    publisher?: string,
    volume?: string,
    number?: string,
    pages?: string,
  ) {
    this.entryType = entryType;
    this.author = author;
    this.title = title;
    this.year = year;
    this.journal = journal;
    this.publisher = publisher;
    this.volume = volume;
    this.number = number;
    this.pages = pages;
  }

  // Method to represent the BibTeX entry in a formatted way
  toBibTeXString(): string {
    let bibtex = `@${this.entryType}{\n`;
    bibtex += `  author = {${this.author}},\n`;
    bibtex += `  title = {${this.title}},\n`;
    bibtex += `  year = {${this.year}},\n`;

    if (this.journal) bibtex += `  journal = {${this.journal}},\n`;
    if (this.publisher) bibtex += `  publisher = {${this.publisher}},\n`;
    if (this.volume) bibtex += `  volume = {${this.volume}},\n`;
    if (this.number) bibtex += `  number = {${this.number}},\n`;
    if (this.pages) bibtex += `  pages = {${this.pages}},\n`;

    bibtex += `}`;
    return bibtex;
  }
}
