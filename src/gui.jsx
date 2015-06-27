"use babel";
import React from 'react';
import Immutable from 'immutable';

let { List } = Immutable;

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="col-md-1">
        <h5>{this.props.data.get('name')}</h5>
        <h5>{this.props.data.get('id')}</h5>
        <h5>{this.props.data.get('zonePos')}</h5>
        <h5>{this.props.data.get('cardId')}</h5>
      </div>
    );
  }
}

Card.propTypes = { data: React.PropTypes.instanceOf(Immutable.Map) };

class MainZone extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let zoneNodes = this.props.zones.map( cards => {
      return cards.map( card => (<Card data={card} />));
    });

    return (
      <div className="col-md-8 text-center">
        <h2>Main Zone</h2>
        <div className="row">
          <h2>OPPOSING GRAVEYARD</h2>
          {zoneNodes.get('OPPOSING GRAVEYARD')}
        </div>
        <div className="row">
          <h2>OPPOSING HAND</h2>
          {zoneNodes.get('OPPOSING HAND')}
        </div>
        <div className="row">
          <h2>OPPOSING SECRET</h2>
          {zoneNodes.get('OPPOSING SECRET')}
        </div>
        <div className="row">
          <h2>OPPOSING PLAY</h2>
          {zoneNodes.get('OPPOSING PLAY')}
        </div>
        <div className="row">
          <h2>FRIENDLY PLAY</h2>
          {zoneNodes.get('FRIENDLY PLAY')}
        </div>
        <div className="row">
          <h2>FRIENDLY SECRET</h2>
          {zoneNodes.get('FRIENDLY SECRET')}
        </div>
        <div className="row">
          <h2>FRIENDLY HAND</h2>
          {zoneNodes.get('FRIENDLY HAND')}
        </div>
        <div className="row">
          <h2>FRIENDLY GRAVEYARD</h2>
          {zoneNodes.get('FRIENDLY GRAVEYARD')}
        </div>
      </div>
    );
  }
}

MainZone.propTypes = { zones: React.PropTypes.instanceOf(Immutable.Map) };

class WindowBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zones: new Immutable.Map({
        'OPPOSING DECK': new List(),
        'OPPOSING GRAVEYARD': new List(),
        'OPPOSING HAND': new List(),
        'OPPOSING SECRET': new List(),
        'OPPOSING PLAY': new List(),
        'FRIENDLY PLAY': new List(),
        'FRIENDLY SECRET': new List(),
        'FRIENDLY HAND': new List(),
        'FRIENDLY GRAVEYARD': new List(),
        'FRIENDLY DECK': new List()
      })
    };
  }

  componentDidMount() {
    let path = require('path');
    let LogStream = require('./log-stream');
    let LogParser = require('./log-parser');

    let logpath = path.join(process.env.HOME, 'Library', 'Logs', 'Unity', 'Player.log');
    this.log_stream = new LogStream(logpath);
    this.log_parser = new LogParser();
    this.log_stream.watch().on('new', (data) => {
      let result = this.log_parser.parse(data);
      if (result !== null && result !== undefined) {
          // console.log(result);
          if (result.actionType === 'zoneChange') {
            this.handleZoneChange(result);
          }
      }
    });
  }

  handleZoneChange(action) {
    console.log(action);
    let card = new Immutable.Map({
      name: action.name,
      id: action.id,
      zonePos: action.zonePos,
      cardId: action.cardId
    });
    let newZones = {};
    if (action.from !== '') {
      newZones[action.from] = this.state.zones.get(action.from)
        .map(c => c.zonePos >= card.zonePos ? c.set('zonePos', c.zonePos - 1) : c)
        .filterNot(x => x.id === card.id)
        .sortBy(c => c.zonePos);
    }
    if (action.to !== '') {
      newZones[action.from] = this.state.zones.get(action.to)
        .map(c => c.zonePos >= card.zonePos ? c.set('zonePos', c.zonePos + 1) : c)
        .push(card)
        .sortBy(c => c.zonePos);
    }
    this.setState( { zones: this.state.zones.merge(newZones) });
  }

  render() {
    return (
      <div>
        <div className="col-md-2">
          <h2>OPPOSING PLAYED</h2>
        </div>
        <MainZone zones={this.state.zones} />
        <div className="col-md-2">
          <h2>FRIENDLY DECK</h2>
        </div>
      </div>
    );
  }
}

WindowBox.propTypes = { zones: React.PropTypes.instanceOf(Immutable.Map) };

React.render(
  <WindowBox />,
  document.getElementById('omnihearth')
);
