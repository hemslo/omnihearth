'use strict';

const LOG_REGEXES = {
  zoneChange: /name=(.*) id=(\d+).*to (FRIENDLY|OPPOSING) (.*)$/
};

class LogParser {
  parse(log) {
    var parts = LOG_REGEXES.zoneChange.exec(log);
    if (parts !== null) {
      var data = {
        cardName: parts[1],
        cardId: parseInt(parts[2]),
        team: parts[3],
        zone: parts[4]
      };
      return data;
    }
    return null;
  }
}

module.exports = LogParser;
