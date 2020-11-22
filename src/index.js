// Every Electron app has 1 main process, which is created by this index.js file
const { app, BrowserWindow } = require('electron');
// app - Uses event based API to control the lifecycles of the app
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// An Electron app has one main process, but it may have multiple Render processes running in 
// A render process is an instance of Chromium, quite like a window or tab in the browser
const createWindow = () => {
  // Create a render process by instantiatig the BrowserWindow.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
      nodeIntegration: true, //Allows to access NodeJS Globals directly, in the Front end code
      enableRemoteModule: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// This event will fire once, when the app is ready | Any initialization logic may be run here
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// As Macs behave in a different way, platform specific code may be implemented here by-
//- checking/identifying the platform/OS 
app.on('window-all-closed', () => {
  // process.platform -> special value provided by Electron
  if (process.platform !== 'darwin') { // darwin - Mac | Win32 - Windows
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
