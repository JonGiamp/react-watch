import React, { Component } from 'react';
import './App.css';

class Needle extends Component {
  getX() {
    return this.props.needle.length * Math.cos(this.props.angle) + this.props.center;
  }
  getY() {
    return (-1) * this.props.needle.length * Math.sin(this.props.angle) + this.props.center;
  }
  render() {
    return (
        <line x1={this.props.center} y1={this.props.center} x2={this.getX()} y2={this.getY()} stroke={this.props.colour} strokeWidth={this.props.needle.width} />
    );
  }
}

class Text extends Component {
  render() {
    return (
      <text x={this.props.x} y={this.props.y} fontFamily="Verdana" fontSize={this.props.center * 0.35} fill={this.props.colour}>
         {this.props.time < 10 ? `0${this.props.time}` : this.props.time}
       </text>
    );
  }
}

class Circle extends Component {
  render() {
    return (
      <circle cx={this.props.center} cy={this.props.center} r={`${this.props.radius}%`} fill={this.props.colour} onClick={() => this.props.onClick()} />
    );
  }
}

const color = ["#F44336", "#E91E63", "#9C27B0", "#03A9F4", "#009688", "#4CAF50", "#CDDC39", "#FFEB3B", "#FF9800", "#FF5722", "#607D8B"];

class App extends Component {
  constructor() {
    super();
    this.state = {
      displayNumeric: false
    };
  }

  updateTimeObject() {
      const now = new Date();
      this.setState({
        milliseconds: now.getMilliseconds(),
        seconds: now.getSeconds(),
        minutes: now.getMinutes(),
        hours: now.getHours()
      });
  }

  changeBackgroundColor() {
    let id = Math.floor(Math.random() * color.length);
    while(color[id] === this.state.backgroundColor)
      id = Math.floor(Math.random() * color.length);
    this.setState({
      backgroundColor: color[id]
    });
  }

  changeDisplayMode() {
    this.setState({
      displayNumeric: this.state.displayNumeric ? false : true
    });
  }

  componentWillMount() {
    this.updateTimeObject();
    setInterval(this.updateTimeObject.bind(this), 25);
    this.setState({
      displayNumeric: false
    });
  }

  componentDidMount() {
    this.changeBackgroundColor();
  }

  render() {
    // Seule et unique valeur en dur, toutes les autres valeurs s'adaptent
    const center = 200;
    const angleS = Math.PI / 2 - Math.PI / 30 * (this.state.seconds + this.state.milliseconds / 1000);
    const angleM = Math.PI / 2 - Math.PI / 30 * (this.state.minutes + (this.state.seconds + this.state.milliseconds / 1000) / 60);
    const angleH = Math.PI / 2 - Math.PI / 6 * (this.state.hours + this.state.minutes / 60);
    const colors = {
      watchBorder: '#212121',
      watchBackground: this.state.backgroundColor,
      innerCircle: '#212121',
      innerDot: '#EEEEEE',
      needleColor: '#212121',
      text: '#212121'
    };
    const needle = {
      s: { width: center * 0.005, length: center * 0.7 },
      m: { width: center * 0.025, length: center * 0.6 },
      h: { width: center * 0.025, length: center * 0.5 }
    };

    function renderNeedle(angle, needle) {
      return <Needle
              angle={angle}
              needle={needle}
              center={center}
              colour={colors.needleColor}
              />
    }

    function renderText(x, y, time) {
      return <Text
            x={x}
            y={y}
            time={time}
            center={center}
            colour={colors.text}
            />
    }

    function renderCircle(radius, colour, onClick = false) {
      return <Circle
              radius={radius * 50 / center}
              colour={colour}
              center={center}
              onClick={onClick}
              />
    }

    return (
      <div className="App">
        <svg width={center * 2} height={center * 2}>
          { renderCircle(center, colors.watchBorder, () => this.changeBackgroundColor()) }
          { renderCircle(center * 0.94, colors.watchBackground, () => this.changeBackgroundColor()) }
          { this.state.displayNumeric ? "" : renderCircle(center * 0.1, colors.innerCircle, () => this.changeBackgroundColor()) }
          { this.state.displayNumeric ? renderText(center * 0.25, center * 1.15, this.state.hours) : renderNeedle(angleS, needle.s) }
          { this.state.displayNumeric ? renderText(center * 0.8, center * 1.15, this.state.minutes) : renderNeedle(angleM, needle.m) }
          { this.state.displayNumeric ? renderText(center * 1.35, center * 1.15, this.state.seconds) : renderNeedle(angleH, needle.h) }
          { this.state.displayNumeric ? "" : renderCircle(center * 0.04, colors.innerDot, () => this.changeBackgroundColor()) }
        </svg><br /><br />
          <input type="button" value="Changer d'affichage" onClick={ ()=>this.changeDisplayMode() }/>
      </div>
    );
  }
}

export default App;
