// https://www.webrtc-experiment.com/

var fs = require('fs');

// don't forget to use your own keys!
var options = {
    // key: fs.readFileSync('fake-keys/privatekey.pem'),
    // cert: fs.readFileSync('fake-keys/certificate.pem')
    key: fs.readFileSync('/home/vgcontrol/CPE490/privkey.pem'),
    cert: fs.readFileSync('/home/vgcontrol/CPE490/fullchain.pem')
};

// HTTPs server
var app = require('https').createServer(options, function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    var link = 'https://github.com/muaz-khan/WebRTC-Experiment/tree/master/socketio-over-nodejs';
    response.write('<title>socketio-over-nodejs</title><h1><a href="'+ link + '">socketio-over-nodejs</a></h1><pre>var socket = io.connect("https://webrtcweb.com:9559/");</pre>');
    response.end();
});


// socket.io goes below

var io = require('socket.io').listen(app, {
    log: true,
    origins: '*:*'
});

//io.set('transports', [
    // 'websocket',
//    'xhr-polling',
//    'jsonp-polling'
//]);

var channels = {};

io.sockets.on('connection', function (socket) {
    //console.log('There has been a new connection');
    var initiatorChannel = '';
    if (!io.isConnected) {
        io.isConnected = true;
    }

    socket.on('new-channel', function (data) {
        console.log('Received packet with new-channel header');
        if (!channels[data.channel]) {
            initiatorChannel = data.channel;
        }

        channels[data.channel] = data.channel;
        onNewNamespace(data.channel, data.sender);
    });

    socket.on('presence', function (channel) {
        console.log('Received packet with presence header');
        var isChannelPresent = !! channels[channel];
        socket.emit('presence', isChannelPresent);
    });

    socket.on('disconnect', function (channel) {
        console.log('Received packet with disconnect header from Connection');
        if (initiatorChannel) {
            delete channels[initiatorChannel];
        }
    });
});

function onNewNamespace(channel, sender) {
    console.log('Setting up a new namespace on this channel');
    console.log(channel);
    io.of('/' + channel).on('connection', function (socket) {
        console.log('Right before io attempts to disconnect');
        var username;
        if (io.isConnected) {
           io.isConnected = false;
           socket.emit('connect', true);
        }

        socket.on('message', function (data) {
            console.log('Received packet with message header');
            if (data.sender == sender) {
                if(!username) username = data.data.sender;
                console.log('Routing message');
                console.log(sender);
                console.log(data.sender);
                socket.broadcast.emit('message', data.data);
            }
        });

        socket.on('disconnect', function() {
            console.log('Received packet with disconnect header from onNewNamespace');
            if(username) {
                socket.broadcast.emit('user-left', username);
                username = null;
            }
        });
    });
}

// run app

app.listen(process.env.PORT || 9559);

process.on('unhandledRejection', (reason, promise) => {
  process.exit(1);
});

console.log('Please open SSL URL: https://localhost:'+(process.env.PORT || 9559)+'/');
