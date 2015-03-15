"use strict";

let fs = require('fs');
let io = require('socket.io/node_modules/socket.io-client')('http://localhost:3000');

let f = fs.createWriteStream('test.wav');

io.on('recording', function(data) { f.write(data) });
io.emit('record', {"time": 5000});
io.on('recording stopped', () => {
  console.log("Done!");
  process.exit();
})
