const { app, BrowserWindow, ipcMain, powerSaveBlocker } = require('electron');

let mainWindow;
let blockerId = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 320,
    height: 220,
    resizable: false,
    title: 'Sleep Blocker',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    if (blockerId !== null) {
      powerSaveBlocker.stop(blockerId);
      blockerId = null;
    }
    mainWindow = null;
  });
}

function setBlock(enabled) {
  if (enabled && blockerId === null) {
    try {
      blockerId = powerSaveBlocker.start('prevent-display-sleep');
    } catch (error) {
      blockerId = null;
    }
  } else if (!enabled && blockerId !== null) {
    powerSaveBlocker.stop(blockerId);
    blockerId = null;
  }

  if (mainWindow) {
    mainWindow.webContents.send('sleep-block-state', enabled);
  }
}

ipcMain.handle('set-sleep-block', (_event, enabled) => {
  setBlock(enabled);
  return enabled;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
