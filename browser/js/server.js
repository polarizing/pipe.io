window.onload = init;
var context;
var bufferLoader;
var bufferList;

function init() {
  // Fix up prefixing
  console.log('hi')
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      '../sounds/SD0000.mp3',
      '../sounds/SD0010.mp3',
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function playSnareShake() {
	var snare = context.createBufferSource();
	snare.buffer = bufferList[0];
	snare.connect(context.destination);
	snare.start(0);
	return 'Snare Shake!'
}

function playSnareTap() {
	var snare = context.createBufferSource();
	snare.buffer = bufferList[1];
	snare.connect(context.destination);
	snare.start(0);
	return 'Snare Tap!'
}


function finishedLoading(_bufferList) {
	console.log('AudioBuffer finished loading.');
	bufferList = _bufferList;
	console.log(playSnareShake())
	console.log(playSnareTap())
  // Create two sources and play them both together.
}

// SOCKETS

var socket = io();
var roomNum = 1;
socket.emit('connect:server', {});
socket.emit('create:room', roomNum);

socket.on('snare:shake', function (data) {
	playSnareShake();
});

socket.on('snare:tap', function (data) {
	playSnareTap();
});

document.ontouchmove = function(event){
    event.preventDefault();
}



