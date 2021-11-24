import { app, BrowserWindow, ipcMain, dialog, Menu, MenuItemConstructorOptions, MenuItem } from 'electron';
import fs from 'fs';
import os from 'os';
import path from 'path';
import config from './config'
import { initWindow, mainWindow } from './window';
import { template } from './menu_template';
// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let closeUnconfirmed = true;

const createWindow = (): void => {
  initWindow();

  const menu_template = template as Array<MenuItemConstructorOptions | MenuItem>;
  const menu = Menu.buildFromTemplate(menu_template);
  Menu.setApplicationMenu(menu);


  mainWindow.on('close', (e) => {
    if (closeUnconfirmed) {
      e.preventDefault();
      mainWindow.webContents.send('closing');
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on('close-window', () => {
  closeUnconfirmed = false;
  mainWindow.close();
});

let prev_width: number;

ipcMain.on('resize-width', (_, nw) => {
  prev_width = mainWindow.getSize()[0]
  // 400/384 is a magical conversion factor
  mainWindow.setSize(Math.floor(nw / 384 * 400), mainWindow.getSize()[1], true)
  fs.writeFileSync(path.resolve(os.homedir(), 'log.txt'), JSON.stringify(mainWindow.getSize()), 'utf-8')
})

ipcMain.on('restore-width', () => {
  mainWindow.setSize(prev_width, mainWindow.getSize()[1])
})

ipcMain.handle('get-notes', () => {

  let notesDir: string = config.notesDir
  let notesFile: string = config.notesFile

  let filepath = path.resolve(notesDir, notesFile)

  try {
    if (!fs.existsSync(notesDir)) {
      fs.mkdirSync(notesDir, { recursive: true })
    }
    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, '[]', 'utf-8')
      return []
    }

    return JSON.parse(fs.readFileSync(filepath, 'utf-8'))

  } catch (e) {
    console.error(e)
  }
})

ipcMain.on('save-notes', (_, nnotes) => {
  let notesDir: string = config.notesDir
  let notesFile: string = config.notesFile

  let filepath = path.resolve(notesDir, notesFile)

  try {
    fs.writeFileSync(filepath, JSON.stringify(nnotes), 'utf-8')
  } catch (e) {
    console.error(e)
  }
})

ipcMain.handle('message-box', (_, args) => {
  return dialog.showMessageBox(args);
})