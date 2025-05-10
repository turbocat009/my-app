
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
      <button id=changekey>
        change Key
      </button>
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
      const changeKey = elem.querySelector("#changekey")
      let play = false;
      let pressed

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
      changeKey.addEventListener("click", () => {
        const keyHandler = (event) => {
          assignedKey = event.key;
          file.key = asignKey();
          changeKey.innerHTML = file.key;
          document.removeEventListener("keydown", keyHandler);
        };
        document.addEventListener("keydown", keyHandler);
      });

      document.addEventListener("keydown", function(event) {
        if(event.key === changeKey.innerHTML){
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
        }

      });


      main.append(elem);
      

    
    
    });
  });
});


let assignedKey = 's';
let oldKey = 's'

function asignKey() {
  if (assignedKey !== 'Escape' && assignedKey !== 'Meta' && assignedKey !== 'Control' && assignedKey !== 'Alt' && assignedKey !== 'Enter' && assignedKey !== 'CapsLock' && assignedKey !== 'Tab' && assignedKey !== 'Shift') {
    console.log(assignedKey);
    oldKey = assignedKey;
    return assignedKey;
  } 
  return oldKey;// Return null if the key is Escape or Meta
}

