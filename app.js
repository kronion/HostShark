var io = require('socket.io').listen(7717);
io.set('heartbeat timeout', 99999);

var hosts = {};

io.sockets.on('connection', function (socket) {
  socket.on('host', function (data) {
    if (hosts[data.host] == undefined) {
      hosts[data.host] = 1;
      console.log(data.host + " " + 1);
    }
    else {
      hosts[data.host] += 1;
      console.log(data.host + " " + hosts[data.host]);
    }
  });
});
