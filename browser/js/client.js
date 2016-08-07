var isMobile = false; //initiate as false
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) isMobile = true;

var socket = io();

socket.on('connect:client', function () {
	console.log('You have connected to the server!')
})

socket.on('init', function () {

})






// Track Accelerometer and Gyroscope
// gyro.frequency = 10;

// if (isMobile) {
//   gyro.startTracking(function(o) {
//         // o.x, o.y, o.z for accelerometer
//         // o.alpha, o.beta, o.gamma for gyro
//         socket.emit('accelerometer', { x: o.x, y: o.y, z: o.z });
//     });
// }

// Shake Event

// var myShakeEvent = new Shake({
//     threshold: 6, // optional shake strength threshold
//     timeout: 100 // optional, determines the frequency of event generation
// });

// myShakeEvent.start();

// window.addEventListener('shake', shakeEventDidOccur, false);

// var shakeCount = 0;
// //function to call when shake occurs
// function shakeEventDidOccur () {
//     socket.emit('snare:shake', 'snare shake event occured');
//     //put your own code here etc.

//     $('.shakeEvent').text(shakeCount++)
// }

