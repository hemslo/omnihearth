'use strict';
var path = require('path');
var LogStream = require('./log-stream');
var LogParser = require('./log-parser');

var logpath = path.join(process.env.HOME, 'Library', 'Logs', 'Unity', 'Player.log');
var log_stream = new LogStream(logpath);
var log_parser = new LogParser();
log_stream.watch().on('new', function (data) {
  let result = log_parser.parse(data);
  if (result !== null) {
      console.log(result);
  }
});
