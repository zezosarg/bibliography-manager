/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { dialog } from 'electron';
import fs from 'fs';
import BibtexParser from '@retorquere/bibtex-parser';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export async function handleFilePick() {
  // Use Electron's dialog to open a file picker
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      // { name: 'All Files', extensions: ['*'] },
      { name: 'Bib TeX Files', extensions: ['bib'] },
    ],
  });
  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    // parse the selected file path
    try {
      const bibFile = fs.readFileSync(filePath, 'utf8');
      const bibData = BibtexParser.parse(bibFile);
      console.log('BibTeX data:', bibData);
      console.log('BibTeX entries:', bibData.entries);
      console.log('BibTeX fields:', bibData.entries[0].fields);
      console.log('BibTeX type:', bibData.entries[0].type);
    } catch (error) {
      console.error('Error reading .bib file:', error);
    }
  }
}
