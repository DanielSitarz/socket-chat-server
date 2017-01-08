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
  socket.on('user enter room', function (chatData) {
    socket.chatData = chatData

    socket.join(socket.chatData.roomName)

    socket.broadcast.to(socket.chatData.roomName).emit('user connected', socket.chatData.userName)

    socket.on('user sent message', function (data) {
      socket.broadcast.to(socket.chatData.roomName).emit('user sent message', data)
    })

    socket.on('user is typing', function (who) {
      socket.broadcast.to(socket.chatData.roomName).emit('user is typing', who)
    })
    socket.on('user stopped typing', function (who) {
      socket.broadcast.to(socket.chatData.roomName).emit('user stopped typing', who)
    })

    socket.on('user changes name', function (newName) {
      var oldName = socket.chatData.userName
      socket.chatData.userName = newName

      socket.broadcast.to(socket.chatData.roomName).emit('user changed name', {
        oldName: oldName,
        newName: newName
      })
    })

    socket.on('disconnect', function (data) {
      socket.broadcast.to(socket.chatData.roomName).emit('user disconnected', socket.chatData.userName)
    })
  })
})

http.listen(process.env.PORT || 5000, function () {
  console.log('listening on *:' + process.env.PORT || 5000)
})
