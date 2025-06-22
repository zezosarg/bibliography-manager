import { IParser } from './IParser';
import Library from '../model/Library';
import Reference from '../model/Reference';

const bibtexParse = require('bibtex-parse');

export default class BibTexParser implements IParser {
  parse(content: string, filePath: string): Library {
    const bibData = bibtexParse.entries(content);
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
}
