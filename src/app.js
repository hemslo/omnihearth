'use strict';
var path = require('path');
var LogStream = require('./log-stream');
var LogParser = require('./log-parser.js');

var logpath = path.join(process.env.HOME, 'Library', 'Logs', 'Unity', 'Player.log');
var log_stream = new LogStream(logpath);
var log_parser = new LogParser();
log_stream.watch().on('new', function (data) {
  console.log(data);
  console.log(log_parser.parse(data));
});
