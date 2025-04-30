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

  issn?: string;

  doi?: string;

  url?: string;

  keywords?: string;

  abstract?: string;

  linkedFilePath?: string;

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
    issn?: string,
    doi?: string,
    url?: string,
    keywords?: string,
    abstract?: string,
    linkedFilePath?: string,
  ) {
    this.key = key || this.generateKey();
    this.entryType = entryType;
    this.title = title;
    this.author = author;
    this.journal = journal;
    this.volume = volume;
    this.number = number;
    this.pages = pages;
    this.year = year;
    this.publisher = publisher;
    this.issn = issn;
    this.doi = doi;
    this.url = url;
    this.keywords = keywords;
    this.abstract = abstract;
    this.linkedFilePath = linkedFilePath;
  }

  generateKey(): string {
    const authorLastName =
      this.author?.split(',')[0]?.trim().toLowerCase() || 'unauthored';
    const yearPart = this.year?.toString() || 'undated';
    const titlePart = this.title?.split(' ')[0]?.toLowerCase() || 'untitled';
    return `${authorLastName}${yearPart}${titlePart}`;
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
    if (this.issn) bibtex += `  issn = {${this.issn}},\n`;
    if (this.doi) bibtex += `  doi = {${this.doi}},\n`;
    if (this.url) bibtex += `  url = {${this.url}},\n`;
    if (this.keywords) bibtex += `  keywords = {${this.keywords}},\n`;
    if (this.abstract) bibtex += `  abstract = {${this.abstract}},\n`;
    if (this.linkedFilePath) bibtex += `  file = {${this.linkedFilePath}},\n`;

    bibtex += `}`;
    return bibtex;
  }

  // static parseBibTeXString(bibFile: string): Reference {
  //   const bibData = bibtexParse.entries(bibFile);
  //   const entry = bibData[0];

  //   const reference = Object.assign(new Reference(), {
  //     key: entry.key,
  //     entryType: entry.type,
  //     title: entry.TITLE,
  //     author: entry.AUTHOR,
  //     journal: entry.JOURNAL,
  //     volume: entry.VOLUME,
  //     number: entry.NUMBER,
  //     pages: entry.PAGES,
  //     year: entry.YEAR,
  //     publisher: entry.PUBLISHER,
  //     issn: entry.ISSN,
  //     doi: entry.DOI,
  //     url: entry.URL,
  //     keywords: entry.KEYWORDS,
  //     abstract: entry.ABSTRACT,
  //     linkedFilePath: entry.FILE,
  //   });

  //   return reference;
  // }
}
