import path from 'path';
import { IParser } from './IParser';
import Library from '../model/Library';
import Reference from '../model/Reference';

export default class RisParser implements IParser {
  parse(content: string, filePath: string): Library {
    const lines = content.split(/\r?\n/);
    const library = new Library(filePath);
    let currentEntry: Record<string, any> = {};

    const bibFilePath = filePath.replace(/\.ris$/, '.bib');
    library.filePath = bibFilePath;
    library.name = path.basename(bibFilePath);

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

        const reference = new Reference(
          library,
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
}
