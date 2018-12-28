import adapter from 'webrtc-adapter';
import visualize from './visualizer/visualizer';

/*
 * STEPS
 *  - Get user media
 *  - Institiate `MediaRecorder`
 *  - Visualize the recording process
 *  - When recording finished , provide playback option
 *  - add option to download
 */

// On this codelab, you will be streaming only video (video: true).
const mediaStreamConstraints = {
    audio: true
  };
  
  // Video element where stream will be placed.
  const audioNode = document.querySelector('#recorNode');
  const recordButton = document.getElementById('recorder');
  const play = document.getElementById('play');
  const stop = document.getElementById('stop');
  const audioControl = document.getElementById('audioControl');

  // create play button
  let playButton = document.createElement('button');
      playButton.textContent = 'play';


  function handleRecording(...params){

    //destructureing the parameters
    let [mediaRecorder, stream, event] = params;

    // disable record button
    event.target.disabled = true;
     
    // start recording
    mediaRecorder.start();

    visualize(stream);
  }

  function stopRecording(mediaRecorder){
    mediaRecorder.state == 'recording'? mediaRecorder.stop(): '';
    mediaRecorder.onstop = function(){
      audioNode.pause();
      audioNode.currentTime = 0;
      audioControl.appendChild(playButton);
    }
  }

  // get recorded data at `ondataavailable` event
  function getRecordedBlob(event){
    audioNode.src = URL.createObjectURL(event.data);
    audioNode.muted = false;
  }
  

  // Handles success of getUsermedia returned promise
  function gotLocalMediaStream(stream) {

    let mediaRecorder = new MediaRecorder(stream);

    recordButton.onclick = handleRecording.bind(null, mediaRecorder, stream);
    stop.onclick = stopRecording.bind(null, mediaRecorder);
    mediaRecorder.ondataavailable = getRecordedBlob;
  }
  
  // Handles error by logging a message to the console with the error message.
  function handleLocalMediaStreamError(error) {
    console.log('navigator.getUserMedia error: ', error);
  }
  
  //console.log(navigator.mediaDevices.getUserMedia(mediaStreamConstraints).then())
  //Initializes media stream.
  navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
    .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
