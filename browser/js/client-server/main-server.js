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
      '../sounds/fingercymbal.mp3',
      '../sounds/balaphone.mp3',
      '../sounds/rimcymbal.mp3',
      '../sounds/dhol.mp3',
      '../sounds/hihat.mp3',
      '../sounds/modernsynth.mp3',
      '../sounds/africandrum.mp3',
      '../sounds/synthbass.mp3'

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

function playBalaphone() {
	var Balaphone = context.createBufferSource();
	Balaphone.buffer = bufferList[6];
	Balaphone.connect(context.destination);
	Balaphone.start(0);
	return 'Balaphone!'
}

function playRimCymbal() {
	var RimCymbal = context.createBufferSource();
	RimCymbal.buffer = bufferList[7];
	RimCymbal.connect(context.destination);
	RimCymbal.start(0);
	return 'RimCymbal!'
}

function playDhol() {
	var Dhol = context.createBufferSource();
	Dhol.buffer = bufferList[8];
	Dhol.connect(context.destination);
	Dhol.start(0);
	return 'Dhol!'
}

function playHiHat() {

	console.log('hi');
	var HiHat = context.createBufferSource();
	HiHat.buffer = bufferList[9];
	HiHat.connect(context.destination);
	HiHat.start(0);
	return 'HiHat!'
}


function playModernSynth () {
	console.log('modernSynth');
	var modernSynth = context.createBufferSource();
	modernSynth.buffer = bufferList[10];
	modernSynth.connect(context.destination);
	modernSynth.start(0);
	return 'modernSynth'
}

function playAfricanDrum () {
	console.log('african drum');

	var africanDrum = context.createBufferSource();
	africanDrum.buffer = bufferList[11];
	africanDrum.connect(context.destination);
	africanDrum.start(0);
	return 'african drum';
}

function playSynthBass () {
	var synthBass = context.createBufferSource();
	synthBass.buffer = bufferList[12];
	synthBass.connect(context.destination);
	synthBass.start(0);
	return 'synth bass'
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
	console.log(playBalaphone());
	console.log(playRimCymbal());
	console.log(playDhol());
	console.log(playHiHat());
	console.log(playAfricanDrum());
	console.log(playSynthBass());
	console.log(playModernSynth());

  // Create two sources and play them both together.
}

// SOCKETS

var socket = io();
var roomNum = 1;
socket.emit('connect:server', {});
socket.emit('create:room', roomNum);

socket.on('snare:shake', function (data) {
	console.log('test');
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
	playFingerCymbal();
})

socket.on('balaphone', function (data) {
	playBalaphone();
})

socket.on('rimcymbal', function (data) {
	playRimCymbal();
})

socket.on('dhol', function (data) {
	playDhol();
})

socket.on('hihat', function (data) {
	playHiHat();
})

socket.on('modernsynth', function (data) {
	playModernSynth();
})

socket.on('africandrum', function (data) {
	playAfricanDrum();
})

socket.on('synthbass', function (data) {
	playSynthBass();
})

document.ontouchmove = function(event){
    event.preventDefault();
}