// Buttons
const videoElement = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');


const { desktopCapturer, remote } = require('electron'); // Electron makes the require() available in the browser
// remote helps to access things in Electron's main process | also used for inter process communication(IPC)
const { Menu } = remote; // Helps to create native menus directly in the UI code
// Accssing the Menu class, running in the Eletron's main process, to create UI elements, to allow users-
//- to select the screen to record 

// getVideoSources() is assigned as the event handler for onClick() on videoSelectionBtn
videoSelectBtn.onclick = getVideoSources();

// Getting access to all the available screens/video sources to record
async function getVideoSources(){
    const inputSources = await desktopCapturer.getSources({ // desktopCapture() returns a promise
        // The return value is an array of Objects | Each obj is window/screen available on the-
        //- machine, to record  
        types: ['window', 'screen']
    }); 

    const videoOptionsMenu = Menu.buildFromTemplate(// Expects an array of obj representing each menuitem
        // Convert array of input sources into array of menu items
        inputSources.map(source => {
            return {
                label: source.name,
                click: () => selectSource(source)
            };
        })
    );

    videoOptionsMenu.popup();
}

// Change window of the videoSource for recording
async function selectSource(source){
    // Set the label of the videoSelectBtn to the name of the source
    videoSelectBtn.innerText = source.name;
    
    // Config to record the video
    const constraints = {
        audio: false,
        video: {
          mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
        }   
        }
    };
   
    
    // Create a streaming video using the Browser's navigator API
    const stream = await navigator.mediaDevices
    .getUserMedia(constraints);
    // Provides a stream of video of whatever is happening in the window
    
    // Preview the source in the HTML Video Element, by assigning the video element to the stream
    videoElement.srcObject = stream;
    videoElement.play();// Will give a realtime feed of the window
}
