import { join, resolve } from 'path'
import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { IBaseSettings, IUser } from './model/baseSetiings'

const isDev = !app.isPackaged
const defaultDir = app.isPackaged
  ? app.getPath('userData')
  : resolve(process.cwd(), './src/electron/data')
let win: BrowserWindow | null = null

interface IData {
  userInfo: IUser | null
  token: string
  baseSetting: IBaseSettings
}
//
let data: IData = {
  userInfo: null,
  token: '',
  baseSetting: {
    btInfo: {
      ipList: [],
      link: '',
      userName: '',
      password: '',
    },
    themeList: [],
    loginInfo: {
      username: '',
      password: '',
      rememberPwd: false,
    },
  },
}

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
  return mainWindow
}

if (!existsSync(join(defaultDir, 'config'))) {
  mkdirSync(join(defaultDir, 'config'))
  writeFileSync(join(defaultDir, `/config/data.txt`), JSON.stringify(data))
} else {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d: any = readFileSync(join(defaultDir, `/config/data.txt`))
  if (d) {
    data = JSON.parse(d)
  }
}

if (!existsSync(join(defaultDir, 'themes'))) {
  mkdirSync(join(defaultDir, 'themes'))
}

if (!existsSync(join(defaultDir, 'chrome'))) {
  mkdirSync(join(defaultDir, 'chrome'))
}

app.whenReady().then(() => {
  win = createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.on('init-data', () => {
    sendToClient('init-data', data)
  })
  ipcMain.on('edit-info', (e, info) => {
    console.log(info)
    data[info.type as keyof IData] = JSON.parse(info.data)
    writeFileSync(join(defaultDir, `/config/data.txt`), JSON.stringify(data))
  })
})
//s
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function sendToClient(channel: string, data: unknown) {
  win?.webContents.send(channel, data)
}
