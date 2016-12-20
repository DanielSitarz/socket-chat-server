var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(data){
    data = JSON.parse(data);
    io.emit('chat message', JSON.stringify(data));
    console.log('msg: ' + data.msg);
  });
});

http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:' + process.env.PORT || 5000);
});