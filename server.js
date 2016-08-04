var path = require('path');

var http = require('http');
var server = http.createServer();

var express = require('express');
var app = express();

var socketio = require('socket.io')

server.on('request', app);

var io = socketio(server);

/*

 {
 roomName: [fn]
 }
 */

var rooms = {
    1: {client: [], server: ""}
}

io.on('connection', function (socket) {

    socket.on('connect:server', function (data) {
        console.log('A server has connected.');
        rooms[1].server = socket.id
    })

    socket.on('connect:client', function (data) {
        console.log('A client has connected.');
        rooms[1].client.push(socket.id);
    })

    socket.on('create:room', function (data) {
    })

    socket.on('chat message', function(msg){
        console.log('hi');
    });

    // socket.on('accelerometer', function (data) {
    //     console.log(data);
    // })
    socket.on('snare:shake', function (data) {
        io.to(rooms[1].server).emit('snare:shake');
    })

    socket.on('snare:tap', function (data) {
        io.to(rooms[1].server).emit('snare:tap');
    })

    socket.on('debug', function (data) {
        console.log(data);
    })
});

server.listen(1337, function () {
    console.log('The server is listening on port 1337!');
});

app.use(express.static(path.join(__dirname, 'browser')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/server', function (req, res) {
    res.sendFile(path.join(__dirname, 'server.html'));
});

app.get('/client', function (req, res) {
    res.sendFile(path.join(__dirname, 'client.html'));
})