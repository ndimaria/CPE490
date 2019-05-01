const HTTPS_PORT = 3000;
const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
//var http = require('http').createServer(app);
//var io = require('socket.io')(http);
var app;

let users = {};

const certOptions = {
  key: fs.readFileSync('/home/vgcontrol/CPE490/privkey.pem'),
  cert: fs.readFileSync('/home/vgcontrol/CPE490/fullchain.pem')
};

app = express();
let httpsServer = https.Server(certOptions, app);

//app.use('/static', express.static());
//app.use('/static', express.static(__dirname + '/public'));
console.log(__dirname);
app.use("/public", express.static(path.resolve(__dirname, 'public')));

let io = socketIO.listen(httpsServer);

//let sockets = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + "/public/index.html");
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    //console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
  //More identifying information should be passed through this function
  socket.on('uid', function(uid){
    console.log('Received uid: ', uid);
    let newUser = {
      userID: uid
    };
    users[newUser.userID] = newUser;
    io.emit('chat message', "User " + uid + " has joined the chat!");
  });
});

httpsServer.listen(HTTPS_PORT, function(){
  console.log('listening on *:3000');
});

//http.listen(3000, function(){
//  console.log('listening on *:3000');
//});
