const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

const NEWS_API_KEY = '241ae247f6e54329865a7e2a6ae228f1';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    resizable: false,
    frame: false,
    icon: path.join(__dirname, 'cardfile-1.ico'),
    backgroundColor: '#008080',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  Menu.setApplicationMenu(null);
  mainWindow.loadFile('index.html');
}

ipcMain.on('window-minimize', () => mainWindow?.minimize());
ipcMain.on('window-maximize', () => {
  if (!mainWindow) return;
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
});
ipcMain.on('window-close', () => mainWindow?.close());

ipcMain.handle('fetch-news', async () => {
  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=10&apiKey=${NEWS_API_KEY}`
    );
    return await res.json();
  } catch {
    return { articles: [] };
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
