var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(7717);
io.set('heartbeat timeout', 99999);

var hosts = {};

io.sockets.on('connection', function (socket) {
  socket.on('host', function (data) {
    if (hosts[data.host] == undefined) {
      var time = new Date();
      var second = time.getSeconds();
      console.log('second of new entry is ' + second);
      hosts[data.host] = [];
      var size = 60;
      while(size--) hosts[data.host].push({ timestamp: time, count: 0 });
      hosts[data.host][second].count = 1;
      console.log(data.host + " " + 1);
      console.error(data.host + " " + 1);
    }
    else {
      var time = new Date();
      for (var i = 0; i < 60; i++) {
        if (time - hosts[data.host][i].timestamp > 60000) {
          hosts[data.host][i].count = 0;
        }
      }
      var second = time.getSeconds();
      hosts[data.host][second].count++;
      hosts[data.host][second].timestamp = time;
      var sum = hosts[data.host].reduce(
        function(prev,current) {
          return current.count + prev;
        }, 0);
      console.log(data.host + " " + sum);
      console.error(data.host + " " + sum);
    }
  });
});

app.get('/data', function(req, res) {
  res.send(hosts);
});

app.listen(7718);
