const { desktopCapture } = require('electron'); // Electron makes the require() available in the browser

// getVideoSources() is assigned as the event handler for onClick() on videoSelectionBtn
videoSelectionBtn.onclick = getVideoSources;

// Buttons
const videoElement = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoSelectionBtn = document.getElementById('videoSelectionBtn');

// Getting access to all the available screens/video sources to record
async function getVideoSources(){
    const inputSources = await desktopCapture.getSources({ // desktopCapture() returns a promise
        // The return value is an array of Objects | Each obj is window/screen available on the-
        //- machine, to record  
        types: ['windows', 'screens']
    })
}