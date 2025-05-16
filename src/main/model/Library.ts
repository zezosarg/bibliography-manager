// Library class to represent a collection of BibTeX references
import path from 'path';
import Reference from './Reference';

const bibtexParse = require('bibtex-parse');

export default class Library {
  // id: string;

  name: string;

  references: Reference[];

  filePath: string;

  constructor(filePath: string, name?: string, references: Reference[] = []) {
    // this.id = crypto.randomUUID();
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
      const library = Library.parseRisString(fileContent, filePath);
      const bibFilePath = filePath.replace(/\.ris$/, '.bib');
      library.filePath = bibFilePath;
      library.name = path.basename(bibFilePath);
      return library;
    }
    if (fileExtension === '.nbib') {
      const library = Library.parseNbibString(fileContent, filePath);
      const bibFilePath = filePath.replace(/\.nbib$/, '.bib');
      library.filePath = bibFilePath;
      library.name = path.basename(bibFilePath);
      return library;
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

        // const reference = Object.assign(new Reference(), {
        //   entryType: currentEntry.entryType?.toLowerCase(),
        //   title: currentEntry.T1,
        //   author: currentEntry[authorKey]
        //     ? currentEntry[authorKey].join(', ')
        //     : '',
        //   journal: currentEntry.JO,
        //   volume: currentEntry.VL,
        //   number: currentEntry.IS,
        //   pages: currentEntry.EP
        //     ? `${currentEntry.SP}-${currentEntry.EP}`
        //     : currentEntry.SP,
        //   year: currentEntry.Y1 || currentEntry.PY,
        //   publisher: currentEntry.PB,
        //   issn: currentEntry.SN,
        //   doi: currentEntry.DO,
        //   url: currentEntry.UR,
        //   abstract: currentEntry.AB,
        //   keywords: currentEntry.KW ? currentEntry.KW.join(', ') : '',
        //   metadata,
        // });
        const reference = new Reference(
          undefined, // id will be auto-generated
          undefined, // key will be auto-generated or set later
          currentEntry.entryType?.toLowerCase(),
          currentEntry.T1,
          currentEntry[authorKey] ? currentEntry[authorKey].join(', ') : '',
          currentEntry.JO,
          currentEntry.VL,
          currentEntry.IS,
          currentEntry.EP
            ? `${currentEntry.SP}-${currentEntry.EP}`
            : currentEntry.SP,
          currentEntry.Y1 || currentEntry.PY,
          currentEntry.PB,
          currentEntry.SN,
          currentEntry.DO,
          currentEntry.UR,
          currentEntry.KW ? currentEntry.KW.join(', ') : '',
          currentEntry.AB,
          undefined, // linkedFilePath
          metadata,
        );
        library.references.push(reference);
        currentEntry = {};
      }
    });

    return library;
  }

  static parseNbibString(nbibFile: string, filePath: string): Library {
    const lines = nbibFile.split(/\r?\n/);
    const library = new Library(filePath);
    let currentEntry: Record<string, any> = {};

    lines.forEach((line) => {
      const match = line.match(/^([A-Z]{2,4})-?\s+-?\s*(.+)$/);
      if (match) {
        const [_, key, value] = match;
        if (key === 'PMID') {
          if (Object.keys(currentEntry).length > 0) {
            const reference =
              Library.createReferenceFromNbibEntry(currentEntry);
            library.references.push(reference);
            currentEntry = {};
          }
          currentEntry[key] = value;
        } else if (key === 'AU' || key === 'MH') {
          currentEntry[key] = currentEntry[key] || [];
          currentEntry[key].push(value);
        } else {
          currentEntry[key] = value;
        }
      }
    });

    if (Object.keys(currentEntry).length > 0) {
      const reference = Library.createReferenceFromNbibEntry(currentEntry);
      library.references.push(reference);
    }

    return library;
  }

  private static createReferenceFromNbibEntry(
    entry: Record<string, any>,
  ): Reference {
    const metadata: Record<string, any> = {};
    Object.entries(entry).forEach(([key, value]) => {
      if (
        ![
          'PMID',
          'TI',
          'AU',
          'TA',
          'VI',
          'IP',
          'PG',
          'DP',
          'PL',
          'IS',
          'LID',
          'AB',
          'MH',
        ].includes(key)
      ) {
        metadata[key] = value;
      }
    });

    // return Object.assign(new Reference(), {
    //   key: entry.PMID,
    //   entryType: 'article',
    //   title: entry.TI,
    //   author: entry.AU ? entry.AU.join(', ') : '',
    //   journal: entry.TA,
    //   volume: entry.VI,
    //   number: entry.IP,
    //   pages: entry.PG,
    //   year: entry.DP ? entry.DP.match(/\d{4}/)?.[0] : undefined,
    //   publisher: entry.PL,
    //   issn: entry.IS,
    //   doi: entry.AID ? entry.AID.replace(/\s*\[doi\]$/, '') : undefined,
    //   abstract: entry.AB,
    //   keywords: entry.MH ? entry.MH.join(', ') : '',
    //   metadata,
    // });

    return new Reference(
      undefined, // id will be auto-generated
      entry.PMID, // key
      'article', // entryType
      entry.TI, // title
      entry.AU ? entry.AU.join(', ') : '', // author
      entry.TA, // journal
      entry.VI, // volume
      entry.IP, // number
      entry.PG, // pages
      entry.DP ? entry.DP.match(/\d{4}/)?.[0] : undefined, // year
      entry.PL, // publisher
      entry.IS, // issn
      entry.AID ? entry.AID.replace(/\s*\[doi\]$/, '') : undefined, // doi
      undefined, // url
      entry.MH ? entry.MH.join(', ') : '', // keywords
      entry.AB, // abstract
      undefined, // linkedFilePath
      metadata,
    );
  }
}
