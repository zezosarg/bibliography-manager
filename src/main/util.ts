/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { dialog, BrowserWindow } from 'electron';
import fs from 'fs';
import Library from './model/Library';
import Reference from './model/Reference';

const bibtexParse = require('bibtex-parse');

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export async function handleFilePick(mainWindow: BrowserWindow) {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      // { name: 'All Files', extensions: ['*'] },
      { name: 'Bib TeX Files', extensions: ['bib'] },
    ],
  });
  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    try {
      const bibFile = fs.readFileSync(filePath, 'utf8');
      const bibData = bibtexParse.entries(bibFile);
      const library = new Library(filePath);
      bibData.forEach((entry: any) => {
        const reference = new Reference(
          entry.key,
          entry.type,
          entry.TITLE,
          entry.AUTHOR,
          entry.JOURNAL,
          entry.VOLUME,
          entry.NUMBER,
          entry.PAGES,
          entry.YEAR,
          entry.PUBLISHER,
        );
        // const reference = Object.assign(new Reference(), entry); // rehydrate the reference, doesn't work
        library.addReference(reference);
      });
      mainWindow.webContents.send('open-library', library);
    } catch (error) {
      console.error('Error reading .bib file:', error);
    }
  }
}

export async function writeLibrary(lib: Library) {
  const references = lib.references.map((ref) => {
    return Object.assign(new Reference(), ref);
  }); // rehydrate lib.references
  const library = new Library(lib.filePath, references); // rehydrate lib
  const bibContent = library.listReferences();
  try {
    fs.writeFileSync(library.filePath, bibContent, 'utf8');
  } catch (error) {
    console.error('Error saving library:', error);
  }
}
