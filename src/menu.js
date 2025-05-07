const { app, Menu, dialog } = require("electron")
var fs = require('fs');

const setMainMenu = (mainWindow) => {
    
    const isMac = process.platform === 'darwin'
    const template = [
        // { role: 'appMenu' }
        ...(isMac
          ? [{
              label: app.name,
              submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
              ]
            }]
          : []),
        // { role: 'fileMenu' }
        {
          label: 'File',
          submenu: [
            { label: 'Open', accelerator: isMac? "Cmd+O" : "Ctrl+O", click:()=>{
                dialog.showOpenDialog(mainWindow, {
                    properties:["openDirectory"],
                }).then((result)=>{
                     const {canceled} = result;
                    if(!canceled){
                        const selectedFolder = result.filePaths[0];
                        console.log(selectedFolder);
                        fs.readdir(selectedFolder, (err, files) => {
                          files.forEach(file => {
                            console.log(file);
                          });
                    })
                    }
                }).catch((err) =>{
                    console.log(err);
                });
            }},
            { type: 'separator'},
            isMac ? { role: 'close' } : { role: 'quit' }
          ]
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
            ...(isMac
              ? [
                  { role: 'pasteAndMatchStyle' },
                  { role: 'delete' },
                  { role: 'selectAll' },
                  { type: 'separator' },
                  {
                    label: 'Speech',
                    submenu: [
                      { role: 'startSpeaking' },
                      { role: 'stopSpeaking' }
                    ]
                  }
                ]
              : [
                  { role: 'delete' },
                  { type: 'separator' },
                  { role: 'selectAll' }
                ])
          ]
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
            { role: 'togglefullscreen' }
          ]
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
                  { role: 'window' }
                ]
              : [
                  { role: 'close' }
                ])
          ]
        },
        {
          role: 'help',
          submenu: [
            {
              label: 'Learn More',
              click: async () => {
                const { shell } = require('electron')
                await shell.openExternal('https://electronjs.org')
              }
            },
            {
                label: 'About'
            }
          ]
        }
      ]
      
      const menu = Menu.buildFromTemplate(template)
      Menu.setApplicationMenu(menu)
}

module.exports = {
    setMainMenu
}