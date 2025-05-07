const txt = document.getElementById("info");

// Listen for updates to the fileList from the main process
window.electron.ipcRenderer.on('update-file-list', (event, fileList) => {
  txt.innerHTML = `Accessible fileList: ${fileList.join(', ')}`;
});