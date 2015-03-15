"use strict";

let spawn = require('child_process').spawn;
let PassThrough = require('stream').PassThrough;
let os = require('os');

const soxArgs = ['-d', '-t', 'dat', '-p'];
const arecordArgs = ['-D', 'plughw:1,0', '-f', 'dat'];

class Recorder {
  constructor() {
    if (os.type().toLowerCase() === "Linux") {
      this.program = "arecord";
      this.args = arecordArgs;
    } else {
      this.program = "sox"
      this.args = soxArgs;
    }
  }

  startCapture() {
    this.ps = spawn(this.program, this.args);
    return this.ps.stdout
  }

  stopCapture() {
    this.ps.kill();
  }
}

module.exports = Recorder;
