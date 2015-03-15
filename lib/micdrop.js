"use strict";

let app = require('http').createServer();
let io = require('socket.io')(app)
let fs = require('fs');
let Recorder = require('./recorder');
let nomnom = require('nomnom');

let rec = new Recorder;

function stopRecording(opts) {
  rec.stopCapture();
  io.emit('recording stopped');
  console.log("Recording stopped...");
}

function startRecording(opts) {
  let stream = rec.startCapture();

  console.log('Recording started...')

  if (opts.time)
    setTimeout(stopRecording, opts.time);

  stream.on('data', buffer => {
    io.emit('recording', buffer);
  });
}

if (!fs.existsSync('static')) fs.mkdirSync('static');

let opts = nomnom()
  .script('micdrop')
  .option('port', {abbr: 'p', default: 3000})
  .parse()

app.listen(opts.port);
console.log(`Listening on port ${opts.port}`)

io.on('connection', socket => {
  socket.emit('connected', {"recording": !!rec.ps})
  socket.on('record', startRecording);
  socket.on('stop recording', stopRecording);
});
