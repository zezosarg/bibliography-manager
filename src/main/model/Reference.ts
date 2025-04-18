// BibTexReference class to represent an individual BibTeX entry
const bibtexParse = require('bibtex-parse');

export default class Reference {
  key?: string; // Unique key for the BibTeX entry

  entryType?: string;

  title?: string;

  author?: string;

  journal?: string;

  volume?: string;

  number?: string;

  pages?: string;

  year?: number;

  publisher?: string;

  constructor(
    key?: string,
    entryType?: string,
    title?: string,
    author?: string,
    journal?: string,
    volume?: string,
    number?: string,
    pages?: string,
    year?: number,
    publisher?: string,
  ) {
    this.key = key;
    this.entryType = entryType;
    this.title = title;
    this.author = author;
    this.journal = journal;
    this.volume = volume;
    this.number = number;
    this.pages = pages;
    this.year = year;
    this.publisher = publisher;
  }

  toBibTeXString(): string {
    let bibtex = `@${this.entryType}{${this.key},\n`;
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

  static parseBibTeXString(bibFile: string): Reference {
    const bibData = bibtexParse.entries(bibFile);
    const entry = bibData[0];

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

    return reference;
  }
}
