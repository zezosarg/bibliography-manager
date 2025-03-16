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
      // console.log(bibData);

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
        library.addReference(reference);
      });

      // console.log('mainWindow: ', mainWindow);
      mainWindow.webContents.send('ipc-example', library);
    } catch (error) {
      console.error('Error reading .bib file:', error);
    }
  }
}
