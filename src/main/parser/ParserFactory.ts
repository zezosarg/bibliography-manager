import path from 'path';
import { IParser } from './IParser';
import BibTexParser from './BibTexParser';
import RisParser from './RisParser';
import NbibParser from './NbibParser';

export default function getParser(filePath: string): IParser {
  const fileExtension = path.extname(filePath).toLowerCase();

  switch (fileExtension) {
    case '.bib':
      return new BibTexParser();
    case '.ris':
      return new RisParser();
    case '.nbib':
      return new NbibParser();
    default:
      throw new Error('Unsupported file type');
  }
}
