function random(min, max) {
  return Math.floor(Math.random() * (+max - +min)) + +min;
}
/**
 * @param `stream` user media stream to visualize
 */
// Get a canvas defined with ID "oscilloscope"
var canvas = document.getElementById("canvasElem");
var canvasCtx = canvas.getContext("2d");

export default function visualize(stream) {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.smoothingTimeConstant = 0.6;
  source.connect(analyser);
  analyser.fftSize = 256;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  requestAnimationFrame(draw);
  function draw() {
    canvasCtx.clearRect(0, 0, canvas.clientHeight, canvas.clientWidth);
    analyser.getByteFrequencyData(dataArray);
    requestAnimationFrame(draw);

    var step = (2 * Math.PI) / bufferLength; // see note 1
    var h = canvas.width / 2;
    var k = canvas.height / 2;
    var r = 40;

    canvasCtx.fillStyle = "rgb(0, 0, 0)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = "red";

    canvasCtx.beginPath(); //tell canvas to start a set of lines

    for (let i = 0; i < bufferLength; i += 2) {
      const angle = step * i;
      const distance = dataArray[i];

      var x = h + r * Math.cos(angle);
      var y = k - r * Math.sin(angle); //note 2.

      canvasCtx.lineTo(x, y);
      canvasCtx.moveTo(x, y);

      var visX = x + (distance * Math.cos(angle)) / 2;
      var visY = y - (distance * Math.sin(angle)) / 2; //note 2.

      canvasCtx.lineTo(visX, visY);
    }

    canvasCtx.closePath(); //close the end to the start point
    canvasCtx.stroke();
  }
}

// draw an oscilloscope of the current audio source
