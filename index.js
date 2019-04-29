var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let users = {};

let sockets = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
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
  socket.on('uid', function(uid, socket){
    console.log('Received uid: ', uid);
    let newUser = {
      userID: uid
    };
    sockets[newUser.userID] = socket;
    users[newUser.userID] = newUser;
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
