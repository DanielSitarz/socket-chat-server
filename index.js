var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){            
  //First what client do is emit current chat data
  /**
   *  chatData = {
   *    userName,
   *    rommName
   *  } 
   */
  socket.on('enter room', function(chatData){
    socket.chatData = chatData;

    socket.join(socket.chatData.roomName);

    sendMessageFromServer(socket.chatData.userName + " connected.");

     socket.on('chat message', function(data){    
       socket.broadcast.to(socket.chatData.roomName).emit('chat message', data);
     }); 

     socket.on('name change', function(newName){    
       var oldName = socket.chatData.userName;
       socket.chatData.userName = newName;
       sendMessageFromServer(oldName + " changes name to " + newName + ".");
     }); 

     socket.on('disconnect', function(data){    
       sendMessageFromServer(socket.chatData.userName + " disconnected.");
     });
  });
});

http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:' + process.env.PORT || 5000);
});

var sendMessageFromServer = function(content){
  socket.broadcast.to(socket.chatData.roomName).emit('chat message', {
      key: (new Date()).getTime(),
      sender: "Chat",
      content: content,
      power: 0,
      isServerMsg: true
  })
}