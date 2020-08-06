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

  function draw() {
    canvasCtx.clearRect(0, 0, canvas.height, canvas.width);
    analyser.getByteFrequencyData(dataArray);
    requestAnimationFrame(draw);

    const x = canvas.width / 2;
    const y = canvas.height / 2;

    const radius = 200;
    const radiusStep = (Math.PI * 2) / bufferLength; // divide circumfurance of circle with buffer length to produce radian for individual bar

    for (let i = 0; i < bufferLength; i += 3) {
      const radian = radiusStep * i; // radian for every byte frequncy data

      // co-ordinates of radian in canvas
      const outerX = x + radius * Math.sin(radian);
      const outerY = y - radius * Math.cos(radian);

      const freq = dataArray[i];

      canvasCtx.save();
      canvasCtx.translate(outerX, outerY);
      canvasCtx.rotate(radian);
      canvasCtx.fillRect(0, y, 10, 5 + freq);
      canvasCtx.restore();
    }
  }

  draw();
}

// draw an oscilloscope of the current audio source
