const { app, BrowserWindow, Menu, dialog } = require("electron");
const path = require('node:path');
const fs = require('fs');

let fileList = [];
let selectedFolder = "";
let aboutWindow = null; // Separate variable for the About window

const createWindowAbout = () => {
  // Check if the About window is already open
  if (aboutWindow) {
    aboutWindow.focus();
    return;
  }

  // Create the About window
  aboutWindow = new BrowserWindow({
    width: 500,
    height: 200,
    parent: null, // No parent window to avoid modal behavior
    modal: false, // Allow interaction with the main window
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load the about.html file
  aboutWindow.loadFile(path.join(__dirname, 'about.html'));

  // Handle the About window close event
  aboutWindow.on('closed', () => {
    aboutWindow = null; // Dereference the About window
  });
};

const setMainMenu = (mainWindow) => {
  const isMac = process.platform === 'darwin';
  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
        {
          label: app.name,
          submenu: [
            {
              label: 'About Sample Player',
              click: async () => {
                createWindowAbout(); // Open the About window
              },
            },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        },
      ]
      : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Folder',
          accelerator: isMac ? 'Cmd+O' : 'Ctrl+O',
          click: () => {
            dialog
              .showOpenDialog(mainWindow, {
                properties: ['openDirectory'],
              })
              .then((result) => {
                const { canceled } = result;
                if (!canceled) {
                  selectedFolder = result.filePaths[0]; // Assign selectedFolder
                  console.log(selectedFolder);

                  // Send selectedFolder to the renderer process
                  fileList = [];
                  fs.readdir(selectedFolder, (err, files) => {
                    files.forEach((file) => {
                      if (
                        file.endsWith('.mp3') ||
                        file.endsWith('.wav') ||
                        file.endsWith('.m4a')
                      ) {
                        fileList.push(file);
                        console.log(fileList);
                      }
                    });

                    // Send updated fileList to the renderer process
                    mainWindow.webContents.send('update-file-list', fileList);
                    mainWindow.webContents.send('selected-folder', selectedFolder);
                    console.log('Sent selected-folder event with:', selectedFolder);
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          },
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' },
          ]
          : [{ role: 'close' }]),
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://electronjs.org');
          },
        },
        !isMac
          ? {
            label: 'About',
            click: async () => {
              createWindowAbout();
            },
          }
          : { role: 'toggleSpellChecker' },
        {
          type: 'separator',
        },
        {
          label: 'GitHub of the creator',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://github.com/turbocat009');
          },
        },
        {
          label: 'GitHub Repository',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://github.com/turbocat009/my-app');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

module.exports = {
  setMainMenu,
};