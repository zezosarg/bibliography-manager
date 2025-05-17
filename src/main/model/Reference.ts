// BibTexReference class to represent an individual BibTeX entry

export default class Reference {
  id: string;

  key?: string;

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

  // Property to store additional (not recognized) fields
  metadata: Record<string, any>;

  constructor(
    id?: string,
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
    metadata: Record<string, any> = {},
  ) {
    this.id = id || crypto.randomUUID();
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
    this.metadata = metadata;
    this.key = key || this.generateKey();
  }

  generateKey(): string {
    const authorLastName =
      this.author?.split(',')[0]?.trim().toUpperCase() || 'unauthored';
    const yearPart = this.year?.toString() || 'undated';
    const titlePart = this.title?.split(' ')[0]?.toUpperCase() || 'untitled';
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

    // Add metadata fields to BibTeX
    Object.entries(this.metadata).forEach(([key, value]) => {
      bibtex += `  ${key} = {${value}},\n`;
    });

    bibtex += `}`;
    return bibtex;
  }

  toHtmlString(): string {
    const authors =
      this.author
        ?.split(' and ')
        .map((name) => {
          const [lastName, firstName] = name.split(',').map((s) => s.trim());
          return `${lastName}, ${firstName.charAt(0)}.`;
        })
        .join(', &#38; ') || 'Unknown Author';

    const journal = this.journal ? `<i>${this.journal}</i>` : '';
    const volume = this.volume ? `<i>${this.volume}</i>` : '';
    const number = this.number ? `(${this.number})` : '';
    const pages = this.pages ? `, ${this.pages.replace('-', '–')}` : '';
    const doi = this.doi ? `https://doi.org/${this.doi}` : '';

    return `
      <div data-csl-entry-id="${this.id}" className="csl-entry">
          ${authors} (${this.year}). ${this.title}. ${journal}, ${volume} ${number}${pages}. ${doi}
      </div>`;
  }
}
