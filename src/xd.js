const main = document.querySelector('main')

// Listen for updates to the fileList from the main process
window.electron.ipcRenderer.on('update-file-list', (event, fileList) => {
  window.electron.ipcRenderer.on('selected-folder', (event, selectedFolder) => {
    main.innerHTML = '';
    fileList.map(fileName => {
      const file = { name: fileName };
      let elem = document.createElement('div');
      elem.innerHTML = `
    <section class="topSection">
      <p id="fileName">${file.name}</p>
      <input id="volume" max="100" min="0" value="100" type="range">
      <button id="options">
        <img src="./Images/config.svg" alt="Image of config" width="25px" height="25px" rotate="90">
      </button>
    </section>
    <section class="bottomSection">
      <p class=info></p>
      <button id="playPause">
        <img src="./Images/play.svg" alt="Image of Button" width="20px" height="20px">
          <audio>
            <source id="audioSource" src="${selectedFolder}/${file.name}" type="audio/mpeg">
          </audio>
      </button>
    </section>
    `;

      const playPause = elem.querySelector('#playPause');
      const img = playPause.querySelector('img')
      const volume = elem.querySelector('input');
      const audio = playPause.querySelector("audio");
      let play = false;

      volume.addEventListener("input", () => {
        console.log(`New volume: ${volume.value}`);
        audio.volume = volume.value/100;
      });

      playPause.addEventListener("click", () => {
        if (play) {
          audio.pause();
          img.src = "./Images/play.svg"
          play = false;
        } else {
          audio.currentTime = 0;
          audio.play();
          img.src = "./Images/pause.svg"
          play = true;

        }
      });
      const info = elem.querySelector(".info")
      file.key = asignKey(); // Assign a key based on the file name
      
      

      info.innerHTML = file.key;
      main.append(elem);
    });
  });
});


function asignKey() {
  const key = "S" // Use the first character of the file name as the key
  console.log(key);
  return key;
}

