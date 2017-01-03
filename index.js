var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){    

  userConnectedEvent(socket);

  socket.on('chat message', function(data){    
    socket.broadcast.emit('chat message', data);    
  });

  socket.on('disconnect', function(data){    
    userDisconnectedEvent(socket);
  });
});

http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:' + process.env.PORT || 5000);
});

var userConnectedEvent = function(socket){
  io.emit('chat message', {
      key: (new Date()).getTime(),
      sender: "Chat",
      content: "User connected.",
      power: 0,
      isServerMsg: true
  })
}

var userDisconnectedEvent = function(socket){
  io.emit('chat message', {
      key: (new Date()).getTime(),
      sender: "Chat",
      content: "User disconnected.",
      power: 0,
      isServerMsg: true
  })
}