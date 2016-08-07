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
      '../sounds/CP.mp3',
      '../sounds/BD0000.mp3',
      '../sounds/maracas.mp3',
      '../sounds/fingercymbal.mp3'
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function playSnareShake() {
	var snare = context.createBufferSource();
	snare.buffer = bufferList[1];
	snare.connect(context.destination);
	snare.start(0);
	return 'Snare Shake!'
}

function playSnareTap() {
	var snare = context.createBufferSource();
	snare.buffer = bufferList[0];
	snare.connect(context.destination);
	snare.start(0);
	return 'Snare Tap!'
}

function playClap() {
	var clap = context.createBufferSource();
	clap.buffer = bufferList[2];
	clap.connect(context.destination);
	clap.start(0);
	return 'Clap Tap!'
}

function playBassDrum() {
	var bass = context.createBufferSource();
	bass.buffer = bufferList[3];
	bass.connect(context.destination);
	bass.start(0);
	return 'Bass drum!'
}

function playMaracas() {
	var maracas = context.createBufferSource();
	maracas.buffer = bufferList[4];
	maracas.connect(context.destination);
	maracas.start(0);
	return 'Maracas!'
}

function playFingerCymbal() {
	var fingerCymbal = context.createBufferSource();
	fingerCymbal.buffer = bufferList[5];
	fingerCymbal.connect(context.destination);
	fingerCymbal.start(0);
	return 'Finger Cymbal!'
}


function finishedLoading(_bufferList) {
	console.log('AudioBuffer finished loading.');
	bufferList = _bufferList;
	console.log(playSnareShake())
	console.log(playSnareTap())
	console.log(playClap())
	console.log(playBassDrum())
	console.log(playMaracas())
	console.log(playFingerCymbal());
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

socket.on('snare:clap', function (data) {
	playClap();
})

socket.on('drum:bass', function (data) {
	playBassDrum();
})

socket.on('maracas', function (data) {
	playMaracas();
})

socket.on('fingerCymbal', function (data) {
	console.log('finger');
	playFingerCymbal();
})

document.ontouchmove = function(event){
    event.preventDefault();
}