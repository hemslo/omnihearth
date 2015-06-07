'use strict';

const LOG_REGEXES = {
  zoneChange: /name=(.*) id=(\d+).*to (FRIENDLY|OPPOSING) (.*)$/,
  actionStart: /ACTION_START Entity=\[(.*)\] SubType=(.*) Index=-?\d+ Target=\[(.*)\]/,
  entity: /(?:name=([\w\s]+))? (?:id=(\d+))? zone=(\w+) zonePos=(\d+) cardId=(\w+) player=(\d+)/,
  start: /id=(\d) ChoiceType=MULLIGAN Cancelable=False CountMin=0 CountMax=\d/,
  finish: /Entity=(.*) tag=PLAYSTATE value=(LOST|WON|TIED)/
};

class LogParser {
  constructor(name) {
    this.routes = {
      'zoneChange': '_zoneChange',
      'actionStart': '_attack',
      'start': '_start',
      'finish': '_finish'
    };
  }

  parse(log) {
    for (let key in this.routes) {
      if (LOG_REGEXES[key].test(log)) {
        return this[this.routes[key]](log);
      }
    }
  }

  _zoneChange(log) {
    var parts = LOG_REGEXES.zoneChange.exec(log);
    return {
      actioType: 'zoneChange',
      cardName: parts[1],
      cardId: parseInt(parts[2]),
      team: parts[3],
      zone: parts[4]
    };
  }

  _attack(log) {
    var parts = LOG_REGEXES.actionStart.exec(log);
    if (parts[2] === 'ATTACK') {
      var entity = this._parseEntity(parts[1]);
      var target = this._parseEntity(parts[3]);
      return {
        actionType: 'attack',
        type: parts[2],
        entity: entity,
        target: target
      };
    }
    return null;
  }

  _start(log) {
    var parts = LOG_REGEXES.start.exec(log);
    return {
      actionType: 'start',
      id: parts[1]
    };
  }

  _finish(log) {
    var parts = LOG_REGEXES.finish.exec(log);
    return {
      actionType: 'finish',
      name: parts[1],
      status: parts[2]
    };
  }

  _parseEntity(entity) {
    var parts = LOG_REGEXES.entity.exec(entity);
    if (parts !== null) {
      return {
        name: parts[1],
        id: parts[2],
        zone: parts[3],
        zonePos: parts[4],
        cardId: parts[5],
        player: parts[6]
      };
    }
    return null;
  }
}

module.exports = LogParser;
