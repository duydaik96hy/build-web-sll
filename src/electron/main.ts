import { join } from 'path'
import { app, BrowserWindow, screen } from 'electron'

const isDev = !app.isPackaged

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: screen.getPrimaryDisplay().workAreaSize.width,
    height: screen.getPrimaryDisplay().workAreaSize.height,
    minWidth: screen.getPrimaryDisplay().workAreaSize.width * 0.6,
    minHeight: screen.getPrimaryDisplay().workAreaSize.height * 0.6,
    icon: join(__dirname, './../../../src/assets/logo.png'),
    webPreferences: {
      preload: join(__dirname, '../electron/preload.js'),
    },
  })
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../../index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
