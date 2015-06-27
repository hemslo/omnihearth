'use strict';

const LOG_REGEXES = {
  zoneChange: /\[Zone\].*\[name=(.*) id=(\d+) zone=(.*) zonePos=(\d+) cardId=(.*) player=(\d)\] zone from (.*) -> (.*)/,
  zoneChangeInvalid: /\[Zone\].*\[id=(\d+) cardId= type=INVALID zone=(.*) zonePos=(\d+) player=(\d)\] zone from (.*) -> (.*)/,
  actionStart: /\[Power\].*ACTION_START Entity=\[(.*)\] SubType=(.*) Index=-?\d+ Target=\[(.*)\]/,
  start: /\[Power\].*CREATE_GAME/,
  tagChange: /TAG_CHANGE Entity=(.+) tag=(\w+) value=(\w+)/,
  entity: /(?:name=([\w\s]+))? (?:id=(\d+))? zone=(\w+) zonePos=(\d+) cardId=(\w+) player=(\d+)/
};

class LogParser {
  constructor(name) {
    this.routes = {
      'zoneChange': '_zoneChange',
      'zoneChangeInvalid': '_zoneChangeInvalid',
      'actionStart': '_actionStart',
      'start': '_start',
      'tagChange': '_tagChange'
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
      actionType: 'zoneChange',
      name: parts[1],
      id: parts[2],
      zone: parts[3],
      zonePos: parts[4],
      cardId: parts[5],
      player: parts[6],
      from: parts[7],
      to: parts[8]
    };
  }

  _zoneChangeInvalid(log) {
    var parts = LOG_REGEXES.zoneChangeInvalid.exec(log);
    return {
      actionType: 'zoneChange',
      name: null,
      id: parts[1],
      zone: parts[2],
      zonePos: parts[3],
      cardId: null,
      player: parts[4],
      from: parts[5],
      to: parts[6]
    };
  }

  _actionStart(log) {
    var parts = LOG_REGEXES.actionStart.exec(log);
    return {
      actionType: 'actionStart',
      entity: this._parseEntity(parts[1]) || parts[1],
      target: this._parseEntity(parts[3]) || parts[3],
      subtype: parts[2]
    };
  }

  _start(log) {
    return {
      actionType: 'start'
    };
  }

  _tagChange(log) {
    var parts = LOG_REGEXES.tagChange.exec(log);
    return {
      actionType: 'tagChange',
      entity: parts[1],
      tag: parts[2],
      value: parts[3]
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
