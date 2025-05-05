// Library class to represent a collection of BibTeX references
import path from 'path';
import Reference from './Reference';

const bibtexParse = require('bibtex-parse');

export default class Library {
  name: string;

  references: Reference[];

  filePath: string;

  constructor(filePath: string, name?: string, references: Reference[] = []) {
    this.name = name || path.basename(filePath);
    this.references = references;
    this.filePath = filePath;
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
      const recognizedFields = [
        'key',
        'type',
        'TITLE',
        'AUTHOR',
        'JOURNAL',
        'VOLUME',
        'NUMBER',
        'PAGES',
        'YEAR',
        'PUBLISHER',
        'ISSN',
        'DOI',
        'URL',
        'KEYWORDS',
        'ABSTRACT',
        'FILE',
      ];

      const metadata: Record<string, any> = {};
      Object.entries(entry)
        .filter(([key]) => !recognizedFields.includes(key))
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, metadata);

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
        issn: entry.ISSN,
        doi: entry.DOI,
        url: entry.URL,
        keywords: entry.KEYWORDS,
        abstract: entry.ABSTRACT,
        linkedFilePath: entry.FILE,
        metadata,
      });
      library.references.push(reference);
    });

    return library;
  }

  static parseRisString(risFile: string, filePath: string): Library {
    const lines = risFile.split(/\r?\n/);
    const library = new Library(filePath);
    let currentEntry: Record<string, any> = {};

    lines.forEach((line) => {
      const match = line.match(/^([A-Z0-9]{2}) {2}- (.+)$/);
      if (match) {
        const [_, key, value] = match;
        if (key === 'TY') {
          currentEntry = { entryType: value };
        } else if (key === 'AU' || key === 'A1') {
          currentEntry[key] = currentEntry[key] || [];
          currentEntry[key].push(value);
        } else if (key === 'KW') {
          currentEntry[key] = currentEntry[key] || [];
          currentEntry[key].push(value);
        } else {
          currentEntry[key] = value;
        }
      } else if (line.startsWith('ER')) {
        const authorKey = currentEntry.AU ? 'AU' : 'A1';
        const metadata: Record<string, any> = {};
        Object.entries(currentEntry).forEach(([key, value]) => {
          if (
            ![
              'TY',
              'T1',
              'AU',
              'A1',
              'JO',
              'VL',
              'IS',
              'SP',
              'EP',
              'Y1',
              'PY',
              'PB',
              'SN',
              'DO',
              'UR',
              'AB',
              'KW',
            ].includes(key)
          ) {
            metadata[key] = value;
          }
        });

        const reference = Object.assign(new Reference(), {
          entryType: currentEntry.entryType,
          title: currentEntry.T1,
          author: currentEntry[authorKey]
            ? currentEntry[authorKey].join(', ')
            : '',
          journal: currentEntry.JO,
          volume: currentEntry.VL,
          number: currentEntry.IS,
          pages: currentEntry.EP
            ? `${currentEntry.SP}-${currentEntry.EP}`
            : currentEntry.SP,
          year: currentEntry.Y1 || currentEntry.PY,
          publisher: currentEntry.PB,
          issn: currentEntry.SN,
          doi: currentEntry.DO,
          url: currentEntry.UR,
          abstract: currentEntry.AB,
          keywords: currentEntry.KW ? currentEntry.KW.join(', ') : '',
          metadata,
        });
        library.references.push(reference);
        currentEntry = {};
      }
    });

    return library;
  }
}
