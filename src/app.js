'use strict';
var path = require('path');
var LogStream = require('./log-stream');

var logpath = path.join(process.env.HOME, 'Library', 'Logs', 'Unity', 'Player.log');
var log_stream = new LogStream(logpath);
log_stream.watch().on('new', function (data) {
  console.log(data);
});
