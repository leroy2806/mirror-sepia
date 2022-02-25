let video = document.getElementById('video');
let video2 = document.getElementById('video2');
const button = document.getElementById('button');
const select = document.getElementById('select');
const WIDTH = 768;
const HEIGHT = 1366;

let timerId = null;
let canvas, ctx, ctx2, ticks = 0, domResult, canvas2;
let currentStream;

video.addEventListener('loadedmetadata', function() {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  canvas2.width = WIDTH;
  canvas2.height = HEIGHT;
}, false);


function stopMediaTracks(stream) {
  stream.getTracks().forEach(track => {
    track.stop();
  });
}
function gotDevices(mediaDevices) {
  select.innerHTML = '';
  select.appendChild(document.createElement('option'));
  let count = 1;
  mediaDevices.forEach(mediaDevice => {
    if (mediaDevice.kind === 'videoinput') {
      const option = document.createElement('option');
      option.value = mediaDevice.deviceId;
      const label = mediaDevice.label || `Camera ${count++}`;
      const textNode = document.createTextNode(label); 
      option.appendChild(textNode);
      select.appendChild(option);
    }
  });
}
button.addEventListener('click', event => {
  if (typeof currentStream !== 'undefined') {
    stopMediaTracks(currentStream);
  }
  const videoConstraints = {};
  if (select.value === '') {
    videoConstraints.facingMode = 'environment';
  } else {
    videoConstraints.deviceId = { exact: select.value };
  }
  const constraints = {
    video: videoConstraints,
    audio: false
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
      video = document.querySelector('#video')
      video2 = document.querySelector('#video2')
      canvas = document.querySelector('#canvas')
      canvas2 = document.querySelector('#canvas2')
      ctx = canvas.getContext('2d')
      ctx2 = canvas2.getContext('2d')
      ctx2.translate(WIDTH, 1);
      ctx2.scale(-1,-1);
      canvas.width = WIDTH
      canvas.height = HEIGHT
      currentStream = stream;
      video.srcObject = stream;
      video2.srcObject=stream;
      return navigator.mediaDevices.enumerateDevices();
    })
    .then(gotDevices)
    .catch(error => {
      console.error(error);
    });
});
var elem = document.getElementById("video2");
var topPos = elem.offsetTop;
document.getElementById('mybutton').onclick = function () {
  console.log('click')
  scrollTo(document.getElementById('contain'), 800, 16000);   
}    
function scrollTo(element, to, duration) {
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;
        
    var animateScroll = function(){        
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

navigator.mediaDevices.enumerateDevices().then(gotDevices);