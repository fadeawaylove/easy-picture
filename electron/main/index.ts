import { app, BrowserWindow, shell, ipcMain, dialog, clipboard, globalShortcut } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import Store from 'electron-store'
const fs = require('fs')
const path = require('path');
const os = require('os');
const mime = require('mime');


// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')


const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';


async function createWindow() {
  win = new BrowserWindow({

    title: 'Easy Picture',
    width: 800,
    height: 600,
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // nodeIntegration: true,
      // contextIsolation: false,
    },
  })
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools()
  } else {
    win.setMenu(null)
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}


async function showOpenDialog(options: Electron.OpenDialogOptions) {
  // 打开文件
  const { canceled, filePaths } = await dialog.showOpenDialog(options)
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}


function getFileNameFromPath(path: string): string {
  const pathSegments = path.split(/[\\/]/);
  const fileName = pathSegments[pathSegments.length - 1];
  return fileName;
}

function generateRandomString(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


const readImageClipboard = () => {
  try {
    let img = clipboard.readImage();
    // 读取文件路径
    if (img.isEmpty()) {
      if (isMac) {
        var filePath = clipboard.read('public.file-url').replace('file://', '');
      } else if (isWindows) {
        var filePath = clipboard.readBuffer('FileNameW').toString('ucs2')
        filePath = filePath.replace(RegExp(String.fromCharCode(0), 'g'), '');
      } else {
        return { err: "不支持的系统" }
      }
      let fileName = getFileNameFromPath(filePath)
      let fileContent = Buffer.from(fs.readFileSync(filePath)).toString("base64")
      let stat = fs.statSync(filePath);
      let lastModified = stat.mtime.toISOString();
      let size = stat.size;
      let lastModifiedDate = stat.mtime;
      let fileType = mime.getType(filePath);
      return { fileName, fileContent, filePath, err: "", lastModified, size, fileType, lastModifiedDate }
    }
    // 从内容读取
    let dataUrl = img.toDataURL();
    const matches = dataUrl.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/)
    if (!matches) {
      return { err: "不是图片" }
    }
    let fileName = generateRandomString(8) + "." + matches[1]
    let fileContent = matches[2]
    // 将图片内容保存到系统临时文件目录
    let tempPath = path.join(os.tmpdir(), fileName);
    fs.writeFileSync(tempPath, Buffer.from(fileContent, "base64"));
    let stat = fs.statSync(tempPath);
    let lastModified = stat.mtime.toISOString();
    let size = stat.size;
    let lastModifiedDate = stat.mtime;
    let fileType = mime.getType(tempPath);
    return { fileName, fileContent, filePath: tempPath, fileType, lastModified, size, lastModifiedDate, err: ""}
  }
  catch (err) {
    return { err }
  }
}


const localStore = new Store({ name: "EasyPicture" })

app.whenReady().then(() => {
  ipcMain.handle('dialog.showOpenDialog', (_, options: Electron.OpenDialogOptions) => { return showOpenDialog(options) })
  ipcMain.handle('fs.readFile', (_, path, options) => fs.readFileSync(path, options))
  ipcMain.handle('clipboard.readImage', (_) => readImageClipboard())
  ipcMain.handle('clipboard.writeText', (_, text: string) => clipboard.writeText(text))
  ipcMain.handle('buffer.base64', (_, b: Uint8Array) => Buffer.from(b).toString("base64"))
  ipcMain.handle('browser.openExternal', (_, u: string) => shell.openExternal(u))
  ipcMain.handle('electron.store.set', (_, k, v) => { return localStore.set(k, v) })
  ipcMain.handle('electron.store.get', (_, k, v) => { return localStore.get(k, v) })
  ipcMain.handle('electron.store.delete', (_, k) => { return localStore.delete(k) })


  ipcMain.on('toggle-devtools', (event) => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (focusedWindow) {
      focusedWindow.webContents.toggleDevTools()
    }
  })

  createWindow()

  globalShortcut.register('F12', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (focusedWindow) {
      focusedWindow.webContents.toggleDevTools()
    }
  })
})

app.on('window-all-closed', () => {
  globalShortcut.unregister('F12')
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
