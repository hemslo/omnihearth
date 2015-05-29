'use strict';
const fs = require('fs');
const events = require('events');

class LogStream extends events.EventEmitter {
  constructor(path) {
    super();
    this.path = path;
  }

  watch() {
    if (!fs.existsSync(this.path)) {
      return;
    }
    console.log('watching ' + this.path);
    var currSize = fs.statSync(this.path).size;
    var self = this;
    var watcher = fs.watch(this.path, function (event, filename) {
      console.log('event: ' + event);
      if (event === 'rename') {
        watcher.close();
        self.watch();
      }
      if (event === 'change') {
        fs.stat(self.path, function (err, stat) {
          self._read(stat.size, currSize);
          currSize = stat.size;
        });
      }
    });
    return this;
  }

  _read(currSize, prevSize) {
    if (currSize <= prevSize) {
      return;
    }
    var self = this;
    var stream = fs.createReadStream(this.path, { encoding: 'utf-8',
                                                  start: prevSize,
                                                  end: currSize});
    stream.on('data', function (data) {
      for (let l of data.split("\n")) {
        self.emit('new', l);
      }
    });
    return this;
  }
}

module.exports = LogStream;
