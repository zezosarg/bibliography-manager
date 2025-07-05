/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import {
  resolveHtmlPath,
  updatePathsFile,
  loadLibraries,
  writeLibrary,
} from './util';
import MenuBuilder from './menu';
import {
  searchReferences,
  findDuplicates,
  exportFormatted,
} from './service/LibraryService';
import Library from './model/Library';
import Reference from './model/Reference';
import {
  saveReference,
  deleteReference,
  createReference,
  addReferences,
  convertReference,
  updateReference,
  linkFile,
} from './service/ReferenceService';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.handle('write-library', async (event, lib) => {
  const library = Library.from(lib);
  const result = writeLibrary(library);
  return result;
});

ipcMain.handle('load-libraries', async () => {
  return loadLibraries();
});

ipcMain.handle('link-file', async (_event, reference) => {
  const refInstance = Reference.from(reference);
  const linkedRef = linkFile(refInstance);
  return linkedRef;
});

ipcMain.handle(
  'search-libraries',
  async (_event, query, searchField, libraries) => {
    const libraryInstances = libraries.map(Library.from);
    const filteredLibrary = searchReferences(
      query,
      searchField,
      libraryInstances,
    );
    return filteredLibrary;
  },
);

ipcMain.handle('find-duplicates', async (_event, library) => {
  const libraryInstance = Library.from(library);
  const duplicateLibrary = findDuplicates(libraryInstance);
  return duplicateLibrary;
});

ipcMain.handle('export-formatted', async (_event, library, format) => {
  const libraryInstance = Library.from(library);
  const copyResult = exportFormatted(libraryInstance, format);
  return copyResult;
});

ipcMain.handle(
  'save-reference',
  async (_event, updatedReference, selectedLibrary) => {
    const libraryInstance = Library.from(selectedLibrary);
    const referenceInstance = Reference.from(updatedReference);
    const updatedLibrary = saveReference(referenceInstance, libraryInstance);
    return updatedLibrary;
  },
);

ipcMain.handle(
  'delete-reference',
  async (_event, selectedReference, selectedLibrary) => {
    const libraryInstance = Library.from(selectedLibrary);
    const referenceInstance = Reference.from(selectedReference);
    const updatedLibrary = deleteReference(referenceInstance, libraryInstance);
    return updatedLibrary;
  },
);

ipcMain.handle('create-reference', async () => {
  const newReference = createReference();
  return newReference;
});

ipcMain.handle(
  'add-references',
  async (_event, libraryToAddRefs, selectedReferences) => {
    const libraryInstance = Library.from(libraryToAddRefs);
    const selectedRefsInstances = selectedReferences.map(Reference.from);
    const updatedLibrary = addReferences(
      libraryInstance,
      selectedRefsInstances,
    );
    return updatedLibrary;
  },
);

ipcMain.handle('convert-reference', async (_event, reference) => {
  const refInstance = Reference.from(reference);
  const convertedRef = convertReference(refInstance);
  return convertedRef;
});

ipcMain.handle('update-reference', async (_event, reference, bibTeXString) => {
  const refInstance = Reference.from(reference);
  const updatedRef = updateReference(refInstance, bibTeXString);
  return updatedRef;
});

ipcMain.on('open-file', async (event, arg) => {
  shell.openPath(arg);
});

ipcMain.on('remove-library', async (event, arg) => {
  updatePathsFile(arg, 'remove');
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

// if (isDebug) {
//   require('electron-debug')(); // Enable DevTools by default in development
// }

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
