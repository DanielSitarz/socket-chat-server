var app = require('express')()
var http = require('http').createServer(app)
var io = require('socket.io')(http)

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function (socket) {
  // First what client do is emit current chat data
  /**
   *  chatData = {
   *    userName,
   *    rommName
   *  }
   */
  socket.on('enter room', function (chatData) {
    socket.chatData = chatData

    socket.join(socket.chatData.roomName)

    io.to(socket.chatData.roomName).emit('user enter the room', socket.chatData.userName)

    socket.on('chat message', function (data) {
      socket.broadcast.to(socket.chatData.roomName).emit('chat message', data)
    })

    socket.on('is typing', function (who) {
      socket.broadcast.to(socket.chatData.roomName).emit('is typing', who)
    })
    socket.on('stopped typing', function (who) {
      socket.broadcast.to(socket.chatData.roomName).emit('stopped typing', who)
    })

    socket.on('name change', function (newName) {
      var oldName = socket.chatData.userName
      socket.chatData.userName = newName
      sendMessageFromServer(socket, oldName + ' changes name to ' + newName + '.')
    })

    socket.on('disconnect', function (data) {
      sendMessageFromServer(socket, socket.chatData.userName + ' disconnected.')
    })
  })
})

http.listen(process.env.PORT || 5000, function () {
  console.log('listening on *:' + process.env.PORT || 5000)
})

var sendMessageFromServer = function (socket, content) {
  var msg = {
    content: content,
    isFromServer: true
  }

  socket.broadcast.to(socket.chatData.roomName).emit('chat message', msg)
}
