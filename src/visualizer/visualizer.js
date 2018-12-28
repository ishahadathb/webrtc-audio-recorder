/** 
 * @param `stream` user media stream to visualize
*/
export default function visualize(stream){
    const audcontext = new AudioContext();
    const source = audcontext.createMediaStreamSource(stream);
    const analyser = audcontext.createAnalyser();
    source.connect(analyser);
    const bufferLength = analyser.frequencyBinCount;

    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    console.log(dataArray);
    
    requestAnimationFrame(draw);

    function draw() {

        requestAnimationFrame(draw);
      
        analyser.getByteTimeDomainData(dataArray);
      
        canvasCtx.fillStyle = "rgb(200, 200, 200)";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(255, 255, 190)";
      
        canvasCtx.beginPath();
      
        var sliceWidth = canvas.width * 1.0 / bufferLength;
        var x = 0;
      
        for (var i = 0; i < bufferLength; i++) {
      
          var v = dataArray[i] / 128.0;
          var y = v * canvas.height / 2;
      
          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
      
          x += sliceWidth;
        }
      
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      }
      
      draw();
}

// Get a canvas defined with ID "oscilloscope"
var canvas = document.getElementById("canvasElem");
var canvasCtx = canvas.getContext("2d");

// draw an oscilloscope of the current audio source

