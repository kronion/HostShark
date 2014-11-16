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
      hosts[data.host] = { lastEdited: time, data: [] };
      var size = 60;
      while(size--) hosts[data.host].data.push({ timestamp: time, count: 0 });
      hosts[data.host].data[second].count = 1;
      console.log(data.host + " " + 1);
      console.error(data.host + " " + 1);
    }
    else {
      var time = new Date();
      var second = time.getSeconds();
      if (time - hosts[data.host].timestamp > 60000) {
        hosts[data.host] = { lastEdited: time, data: [] };
        var size = 60;
        while(size--) hosts[data.host].data.push({ timestamp: time, count: 0 });
        hosts[data.host].data[second].count = 1;
      }
      else {
        for (var i = 0; i < 60; i++) {
          if (time - hosts[data.host].data[i].timestamp > 60000) {
            hosts[data.host].data[i].count = 0;
            hosts[data.host].data[i].timestamp = time;
          }
        }
        hosts[data.host].data[second].count++;
      }
      hosts[data.host].lastEdited = time;
      var sum = hosts[data.host].data.reduce(
        function(prev,current) {
          return current.count + prev;
        }, 0);
      console.log(data.host + " " + sum);
      console.error(data.host + " " + sum);
    }
  });
});

app.get('/data', function(req, res) {
  var time = Date.now();
  for (var k in hosts) {
    if (time - hosts[k].lastEdited > 60000) {
      delete hosts[k];
    }
  }
  res.send(hosts);
});

app.listen(7718);
