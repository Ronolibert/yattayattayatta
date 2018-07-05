import React, { Component } from 'react';
import logo from './logo.svg';
import HighlightArea from './HighlightArea';
import './App.css';

class Card extends Component {
  state = {
    hovered: false,
  };

  render() {
    const { hovered } = this.state;
    const { children } = this.props;
    return (
      <div
        onMouseOut={() => this.setState(() => ({ hovered: false }))}
        onMouseOver={() => this.setState(() => ({ hovered: true }))}
        style={{
          backgroundColor: hovered ? 'blue' : 'white',
          border: '1px solid black',
          height: 100,
          userSelect: 'none',
        }}
      >
        {children}
      </div>
    );
  }
}

class App extends Component {
  get mockData() {
    const data = [];
    for (let i = 0; i < 50; i++) {
      data.push(<Card>Something</Card>);
    }
    return data;
  }
  render() {
    return (
      <HighlightArea>
        {() => (
          <div
            style={{
              display: 'grid',
              gridGap: 50,
              gridTemplateColumns: 'repeat(5, 100px)',
            }}
          >
            {this.mockData}
          </div>
        )}
      </HighlightArea>
    );
  }
}

export default App;
