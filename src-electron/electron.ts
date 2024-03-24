import { app, BrowserWindow } from 'electron';

import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ 
        width: 800, 
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            // devTools: (process.env.LOCAL_HOST) ? true : false,
        }
    });

    const startUrl = process.env.LOCAL_HOST || url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    });

    // and load the index.html of the app.
    mainWindow.loadURL(startUrl);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    // eslint-disable-next-line no-undef
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.