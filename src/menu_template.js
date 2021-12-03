import { mainWindow } from './window';

const template = [
    {
        label: 'File',
        submenu: [{
            label: 'New note',
            accelerator: 'Ctrl+N',
            click: () => mainWindow.webContents.send('new-note')
        }, ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Bold',
                accelerator: 'Ctrl+B',
                click: () => mainWindow.webContents.send('bold')
            },
            {
                label: 'Italicize',
                accelerator: 'Ctrl+I',
                click: () => mainWindow.webContents.send('italic')
            },
            {
                label: 'Underline',
                accelerator: 'Ctrl+U',
                click: () => mainWindow.webContents.send('underline')
            },
            {
                type: 'separator'
            },
            {
                label: 'Copy',
                role: 'copy',
                accelerator: 'Ctrl+C',
            },
            {
                label: 'Cut',
                role: 'cut',
                accelerator: 'Ctrl+X',
            },
            {
                label: 'Paste',
                role: 'paste',
                accelerator: 'Ctrl+V',
            },
            {
                type: 'separator'
            },
            {
                label: 'Save',
                accelerator: 'Ctrl+S',
                click: () => mainWindow.webContents.send('save')
            },
        ]
    },
    {
        label: 'View',
        submenu: [{
                label: 'Refresh',
                role: 'reload',
                accelerator: 'Ctrl+R',
            },
            {
                label: 'Developer Tools',
                role: 'toggleDevTools',
                accelerator: 'Ctrl+Shift+I'
            },
            {
                type: 'separator'
            },
            {
                label: 'Zoom In',
                role: 'zoomIn',
                accelerator: 'Ctrl+=',
            },
            {
                label: 'Zoom Out',
                role: 'zoomOut',
                accelerator: 'Ctrl+-',
            },
            {
                label: 'Reset Zoom',
                role: 'resetZoom',
                accelerator: 'Ctrl+0',
            },
            {
                type: 'separator'
            },
            {
                label: 'Full Screen',
                role: 'togglefullscreen',
                accelerator: 'F11',
            },
        ]
    },
    {
        label: 'Window',
        submenu: [{
                label: 'Minimize',
                role: 'minimize',
                accelerator: 'Ctrl+M'
            },
            {
                label: 'Close',
                role: 'close',
                accelerator: 'Ctrl+Q',
            }
        ]
    }
];

export {
    template
};