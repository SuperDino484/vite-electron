# How to setup
To start, create a vite project. I am using npm so my command would be ```npm create vite@latest my-vue-app -- --template react-ts``` to create a react typescript application. Once that is done also install ```npm install --save-dev electron electron-builder```. Now everything is setup.

Create a ```vite.config.electron.ts``` or ```.js``` if you have a javascript project. Inside the contents should be:
```javascript
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    publicDir: false,
    build: {
        emptyOutDir: false,
        ssr: "src-electron/electron.ts",
    }
})
```

Now inside the ```vite.config.js``` file add ```base: './'```, so the config should be:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
})
```

Next create a ```src-electron``` folder in the root project directory, and in there create an ```electron.ts``` file. The contents should be:
```javascript
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
            offscreen: true,
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
```

In the ```public``` directory create a ```preload.ts``` script. This does not have to have anything, you could also remove the preload from the BrowserWindow settings to not have one. Now, there are a couple commands to run the project and build it (package.json). They are listed here:
```json
"electron:build": "vite build -c vite.config.electron.js", // Do not run directly
"electron": "set LOCAL_HOST=http://localhost:5173 && electron dist/electron.js", // Run after npm run build:dev
"build:electron": "electron-builder -c.extraMetadata.main=dist/electron.js", // Packages the application, must have the flag pointing to the main file.
"build:dev": "npm run build && npm run electron:build && npm run dev", // Run this to recompile the app and build it, then run npm run electron to get the electron window.
```

Also in the ```package.json``` make sure to add these lines:
```json
"main": "./src-electron/electron.ts",
"build": {
    "files": [
      "dist/**/*"
    ]
},
```
This enables the packaging of the app to work properly and not show a blank screen when opening.

This should be all that is needed to run the electron app and build it with vite and react. I have not tested with the other vite frameworks but they should work the same. You can also install sass, scss, tailwindcss, etc. and it all should just work if setup properly according to their documentation.

# DISCLAIMER: I am not liable for any security issues, this is simply a guide on how to set up electron and vite, please refer to their documentation for proper security protocols.