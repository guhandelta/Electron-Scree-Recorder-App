// Buttons
const videoElement = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');


const { desktopCapturer, remote } = require('electron'); // Electron makes the require() available in the browser
// remote helps to access things in Electron's main process | also used for inter process communication(IPC)
const { Menu, dialog } = remote; // Helps to create native menus directly in the UI code
// Accssing the Menu class, running in the Eletron's main process, to create UI elements, to allow users-
//- to select the screen to record 
// dialog - Display native system dialogs for opening and saving files, alerting, etc.
const { writeFile } = require('fs');

startBtn.onclick = e => {
  mediaRecorder.start();
  startBtn.classList.add('is-danger');
  startBtn.innerText = 'Recording';
};

stopBtn.onclick = e => {
  mediaRecorder.stop();
  startBtn.classList.remove('is-danger');
  startBtn.innerText = 'Start';
};

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

let mediaRecorder; // MediaRecoder Instance to capture screen activity
const recordedChunks = [];
// Array to store video chunks, which would allow recording screen activity in multiple segments

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

    // Create Media Recoder
    const options = { mimeType: 'video/webm; codecs=vp9' }
    // The MIME media type which describes the format of the recorded media, as a DOMString.
    // Just describing a video in an MPEG-4 file with the MIME type video/webm doesn't say anything-
    //- about what format the actual media within takes.
    // For that reason, the codecs parameter can be added to the MIME type describing media content.-
    //- With it, container-specific information can be provided. This information may include things-
    //- like the profile of the video codec, the type used for the audio tracks, and so forth.

    // Instantiate the MediaRecorder class with passing in the stream as args
    mediaRecorder = new MediaRecorder(stream, options);

    // The recorder can be controlled, as it has an event based API, so defining EventHandlers for 2 of-
    //- the events, helps to create functions to allow user to control the video
    mediaRecorder.ondataavailable = handleAvailableData;
    mediaRecorder.onstop = handleStop;
}

// Fn to capture all the recorded chunks and pushes those into recordedChunks[]
function handleAvailableData(e){
    console.log('video data available');
    recordedChunks.push(e.data);
}

// fn() to save the video file on stop
async function handleStop(e){
    // The Blob object represents a blob, which is a file-like object of immutable, raw data; they can be-
    //- read as text or binary data, or converted into a ReadableStream so its methods can be used for-
    //- processing the data.
    const videoBlob = new Blob(recordedChunks, {
        type: 'video/webm; codecs=vp9'
    });

    // Getting the data back in a proper format, to be played back as a video
    const buffer = Buffer.from(await videoBlob.arrayBuffer());
    // The Blob object represents a blob, which is a file-like object of immutable, raw data; they can-
    //- be read as text or binary data, or converted into a ReadableStream so its methods can be used-
    //- for processing the data.

    const { filePath } = await dialog.showSaveDialog({// this fn() will resolve to the filepath that the-
        //- user just selected
        buttonLabel: 'Save video',
        defaultPath: `vid-${Date.now()}.webm` // DefaultPath that timestamps the video
    });

    if (filePath) {
        writeFile(filePath, buffer, () => console.log('video saved successfully!'));
    }
    // buffer -> Arg for raw data
    // This is a callback based API, so pass in a callback() to console log a success msg
}