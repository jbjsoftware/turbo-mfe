import { app, BrowserWindow, shell, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import isDev from "electron-is-dev";
import * as path from "path";

class AppUpdater {
  constructor() {
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    icon: getAssetPath("icon.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "../preload/preload.js"),
    },
  });

  // Load the appropriate URL based on environment
  if (isDev) {
    // Development: load from the host app's dev server
    mainWindow.loadURL("http://localhost:3000");
  } else {
    // Production: load from the built host app
    const hostPath = app.isPackaged
      ? path.join(process.resourcesPath, "host/dist/index.html")
      : path.join(__dirname, "../../../host/dist/index.html");
    mainWindow.loadFile(hostPath);
  }

  // Show window when ready to prevent visual flash
  mainWindow.once("ready-to-show", () => {
    if (!mainWindow) {
      throw new Error("mainWindow is not defined");
    }
    mainWindow.show();

    // Focus on window
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

// Handle app protocol for deep linking (optional)
app.setAsDefaultProtocolClient("mfe-turbo");

// Handle deep link on Windows/Linux
app.on("second-instance", (event, commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window instead
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    // Someone tried to run a second instance, we should focus our window instead
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Utility functions
const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, "assets")
  : path.join(__dirname, "../../assets");

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

// IPC handlers (for communication with renderer process)
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("get-platform", () => {
  return process.platform;
});

// Handle app updates
ipcMain.handle("check-for-updates", () => {
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

ipcMain.handle("quit-and-install", () => {
  if (!isDev) {
    autoUpdater.quitAndInstall();
  }
});
