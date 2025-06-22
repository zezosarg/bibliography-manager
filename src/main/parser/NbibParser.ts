import path from 'path';
import { IParser } from './IParser';
import Library from '../model/Library';
import Reference from '../model/Reference';

export default class NbibParser implements IParser {
  parse(content: string, filePath: string): Library {
    const lines = content.split(/\r?\n/);
    const library = new Library(filePath);
    let currentEntry: Record<string, any> = {};

    lines.forEach((line) => {
      const match = line.match(/^([A-Z]{2,4})-?\s+-?\s*(.+)$/);
      if (match) {
        const [_, key, value] = match;
        if (key === 'PMID') {
          if (Object.keys(currentEntry).length > 0) {
            const reference = this.createReferenceFromNbibEntry(currentEntry);
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
      const reference = this.createReferenceFromNbibEntry(currentEntry);
      library.references.push(reference);
    }

    const bibFilePath = filePath.replace(/\.nbib$/, '.bib');
    library.filePath = bibFilePath;
    library.name = path.basename(bibFilePath);

    return library;
  }

  private createReferenceFromNbibEntry(entry: Record<string, any>): Reference {
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

    return new Reference(
      undefined, // id will be auto-generated
      entry.PMID, // key
      'article', // entryType
      entry.TI, // title
      entry.AU ? entry.AU.join(', ') : '', // author
      entry.TA, // journal
      entry.VI, // volume
      entry.IP, // number
      entry.PG ? entry.PG : entry.AID?.match(/\/([^\/\s\[]+)(?=\s|\[|$)/)?.[1], // pages
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
