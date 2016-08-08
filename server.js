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
    1: {client: [], server: "", id: 1, views: {1: false, 2: false, 3: false, 4: false}}
}

io.on('connection', function (socket) {

    socket.on('disconnect', function () {
        console.log('got disconnected');
        // for (var room in rooms) {
        //     var clients = rooms[room].client
        //     for (var i = 0; i < clients.length; i++) {
        //         if (clients[i].id === socket.id) {
        //             rooms[room].views[clients[i].view] = false;
        //             clients.splice(i, 1);
        //         }
        //     }
        // }
    })

    socket.on('connect:server', function (data) {
        console.log('A server has connected.');
        for (var room in rooms) {
            if (rooms[room].server == "") {
                rooms[room].server = socket.id;
                rooms[room].createdAt = Date.now();
                rooms[++room] = {client: [], server: "", id: room, views: {1: false, 2: false, 3: false, 4: false}};
                console.log(rooms);
            }
        }
    })

    socket.on('connect:client', function (data) {
        console.log('A client has connected.');
        var active = [];
        for (var room in rooms) {
            if (rooms[room].server !== "") active.push(rooms[room]);
        }
        io.to(socket.id).emit('rooms', active);
        // rooms[1].client.push(socket.id);
    })

    socket.on('connect:room', function (data) {
        var roomData = data;
        var room = rooms[roomData.id]
        var viewAssign = function () {
            for (var view in room.views) {
                if (!room.views[view]) {
                    room.views[view] = true;
                    return view;
                } 
            }
        }
        var assignedView = viewAssign();
        room.client.push(socket.id);
        io.to(socket.id).emit('client:ready', {room: room, view: assignedView})
    })

    socket.on('room:connected', function (data) {
        console.log('test');
        io.to(data.room.server).emit('room:connected', data);
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
        io.to(data.room.server).emit('snare:shake');
    })

    socket.on('snare:tap', function (data) {
        console.log('shake');
        io.to(data.room.server).emit('snare:tap');
    })

    socket.on('snare:clap', function (data) {
        console.log('clap');
        io.to(data.room.server).emit('snare:clap');
    })

    socket.on('drum:bass', function (data) {
        console.log('bass');
        io.to(data.room.server).emit('drum:bass');
    })

    socket.on('maracas', function (data) {
        console.log('maracas');
        io.to(data.room.server).emit('maracas');
    })

    socket.on('fingerCymbal', function (data) {
        console.log('fingerCymbal');
        io.to(data.room.server).emit('fingerCymbal', data);
    })

    socket.on('balaphone', function (data) {
        console.log('balaphone')
        io.to(data.room.server).emit('balaphone');
    })

    socket.on('rimcymbal', function (data) {
        console.log('rim cymbal')
        io.to(data.room.server).emit('rimcymbal');
    })

    socket.on('dhol', function (data) {
        console.log('dhol')
        io.to(data.room.server).emit('dhol');
    })

    socket.on('hihat', function (data) {
        io.to(data.room.server).emit('hihat');
    })

    socket.on('modernsynth', function(data) {
        console.log('modernsynth')
        io.to(data.room.server).emit('modernsynth', data);
    })

    socket.on('africandrum', function(data) {
        console.log('africandrum')
        io.to(data.room.server).emit('africandrum', data);
    })

    socket.on('synthbass', function(data) {
        console.log('synthbass');
        io.to(data.room.server).emit('synthbass', data);
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