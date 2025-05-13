/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { dialog, BrowserWindow } from 'electron';
import fs from 'fs';
import os from 'os';
import Library from './model/Library';
import Reference from './model/Reference';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export async function updatePathsFile(
  library: Library,
  action: 'add' | 'remove',
) {
  const pathsFilePath = path.join(os.homedir(), 'bibliographyManager.json');
  let pathsData: { paths: string[] } = { paths: [] };

  if (fs.existsSync(pathsFilePath)) {
    const fileContent = fs.readFileSync(pathsFilePath, 'utf8');
    pathsData = JSON.parse(fileContent);

    if (action === 'add' && !pathsData.paths.includes(library.filePath)) {
      pathsData.paths.push(library.filePath);
    } else if (action === 'remove') {
      pathsData.paths = pathsData.paths.filter((p) => p !== library.filePath);
    }
    fs.writeFileSync(pathsFilePath, JSON.stringify(pathsData, null, 2), 'utf8');
  }
}

export function openFileDialog(fileTypes: string[]) {
  return dialog.showOpenDialog({
    properties: ['openFile'],
    filters: fileTypes.map((type) => ({
      name: type.toUpperCase(),
      extensions: [type],
    })),
  });
}

export async function handleFilePick(mainWindow: BrowserWindow) {
  const result = await openFileDialog(['bib', 'ris', 'nbib']);

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    try {
      const bibFile = fs.readFileSync(filePath, 'utf8');
      const library = Library.parseString(bibFile, filePath);
      if (path.extname(filePath).toLowerCase() === '.ris') {
        const bibFilePath = filePath.replace(/\.ris$/, '.bib');
        fs.writeFileSync(bibFilePath, library.listReferences(), 'utf8');
        library.filePath = bibFilePath;
        library.name = path.basename(bibFilePath);
      }
      updatePathsFile(library, 'add');
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
  const library = new Library(lib.filePath, lib.name, references); // rehydrate lib
  const bibContent = library.listReferences();
  try {
    fs.writeFileSync(library.filePath, bibContent, 'utf8');
  } catch (error) {
    console.error('Error saving library:', error);
  }
}

export async function handleNewFile(mainWindow: BrowserWindow) {
  const result = await dialog.showSaveDialog({
    title: 'Create New Library',
    defaultPath: 'NewLibrary.bib', // Default file name
    filters: [{ name: 'BibTeX Files', extensions: ['bib'] }],
  });

  if (!result.canceled && result.filePath) {
    const { filePath } = result;
    try {
      fs.writeFileSync(filePath, '', 'utf8');
      const library = new Library(filePath);
      updatePathsFile(library, 'add');
      mainWindow.webContents.send('open-library', library);
    } catch (error) {
      console.error('Error creating new library file:', error);
    }
  }
}

export async function loadLibraries() {
  const filePath = path.join(os.homedir(), 'bibliographyManager.json');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ paths: [] }, null, 2), 'utf-8');
    return []; // Return an empty array if the file doesn't exist
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  const { paths } = JSON.parse(data);

  const libraries = paths.map((libraryPath: string) => {
    if (fs.existsSync(libraryPath)) {
      const libraryData = fs.readFileSync(libraryPath, 'utf-8');
      return Library.parseString(libraryData, libraryPath);
    }
    return null;
  });

  return libraries.filter((library: Library) => library !== null); // Filter out invalid paths
}
