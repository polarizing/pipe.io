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
        console.log('shake');
        console.log(data);
        io.to(rooms[1].server).emit('snare:shake');
    })

    socket.on('snare:tap', function (data) {
        console.log('shake');
        io.to(rooms[1].server).emit('snare:tap');
    })

    socket.on('snare:clap', function (data) {
        console.log('clap');
        io.to(rooms[1].server).emit('snare:clap');
    })

    socket.on('drum:bass', function (data) {
        console.log('bass');
        io.to(rooms[1].server).emit('drum:bass');
    })

    socket.on('maracas', function (data) {
        console.log('maracas');
        io.to(rooms[1].server).emit('maracas');
    })

    socket.on('fingerCymbal', function (data) {
        console.log('fingerCymbal');
        io.to(rooms[1].server).emit('fingerCymbal', data);
    })

    socket.on('balaphone', function (data) {
        console.log('balaphone')
        io.to(rooms[1].server).emit('balaphone');
    })

    socket.on('rimcymbal', function (data) {
        console.log('rim cymbal')
        io.to(rooms[1].server).emit('rimcymbal');
    })

    socket.on('dhol', function (data) {
        console.log('dhol')
        io.to(rooms[1].server).emit('dhol');
    })

    socket.on('hihat', function (data) {
        io.to(rooms[1].server).emit('hihat');
    })

    socket.on('modernsynth', function(data) {
        console.log('modernsynth')
        io.to(rooms[1].server).emit('modernsynth', data);
    })

    socket.on('africandrum', function(data) {
        console.log('africandrum')
        io.to(rooms[1].server).emit('africandrum', data);
    })

    socket.on('synthbass', function(data) {
        console.log('synthbass');
        io.to(rooms[1].server).emit('synthbass', data);
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