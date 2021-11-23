import { BrowserWindow } from "electron";
import path from 'path';

let mainWindow: BrowserWindow;

export function initWindow(): BrowserWindow {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        icon: path.resolve('./favicon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            zoomFactor: 1.0,
        }
    });

    return mainWindow;
}

export {
    mainWindow
}