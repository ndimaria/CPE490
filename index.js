const HTTPS_PORT = 3000;
const HTTP_PORT = 4000;
const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
//var http = require('http').createServer(app);
//var io = require('socket.io')(http);
var app;

var httpApp = express();
var httpServer = http.createServer(express);
httpApp.get("*", function(req, res){
  res.redirect('https://demo.roomsfh.org:3000');
});

let users = {};

const certOptions = {
  key: fs.readFileSync('/home/vgcontrol/CPE490/privkey.pem'),
  cert: fs.readFileSync('/home/vgcontrol/CPE490/fullchain.pem')
};

app = express();
app.use(redirectToHTTPS());
let httpsServer = https.Server(certOptions, app);

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

//app.use('/static', express.static());
//app.use('/static', express.static(__dirname + '/public'));
console.log(__dirname);
app.use("/public", express.static(path.resolve(__dirname, 'public')));

let io = socketIO.listen(httpsServer);

//let sockets = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + "/public/index.html");
});
///////////dictionary///////////
//var ID_Info = {};

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg,id){
    //console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
  //More identifying information should be passed through this function
  socket.on('uid', function(uid){
    console.log('Received uid: ', uid);
    //ID_Info.uid = color;
    let newUser = {
      userID: uid
    };
    users[newUser.userID] = newUser;
    io.emit('chat message', "User " + uid + " has joined the chat!");
  });
});

httpServer.listen(HTTP_PORT);
httpsServer.listen(HTTPS_PORT, function(){
  console.log('listening on *:3000');
});

//http.listen(3000, function(){
//  console.log('listening on *:3000');
//});
