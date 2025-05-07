const main = document.querySelector('main')

// Listen for updates to the fileList from the main process
window.electron.ipcRenderer.on('update-file-list', (event, fileList) => {
  window.electron.ipcRenderer.on('selected-folder', (event, selectedFolder) => {
    main.innerHTML = '';
    fileList.map(file => {
      let elem = document.createElement('div');
      elem.innerHTML = `
    <section>
      <p>${file}</p>
    </section>
    <section class="bottomSection">
      <button id="playPause">
        <img src="./Images/play.svg" alt="Image of Button" width="20px" height="20px">
        <audio>
          <source id="audioSource" src="${selectedFolder}/${file}" type="audio/mpeg">
        </audio>
      </button>
    </section>
    `;

      const playPause = elem.querySelector('button');
      const img = playPause.querySelector('img')
      let play = false;

      playPause.addEventListener("click", () => {
        const audio = playPause.querySelector("audio");
        if (play) {
          audio.pause();
          img.src = "./images/play.svg"
          play = false;
        } else {
          audio.currentTime = 0;
          audio.play();
          img.src = "./images/pause.svg"
          play = true;

        }
      });

      main.append(elem);






    });
  });
});



