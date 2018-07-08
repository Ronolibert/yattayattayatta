import React, { Component } from 'react';
import logo from './logo.svg';
import HighlightArea from './HighlightArea';
import './App.css';

class App extends Component {
  state = {
    data: new Array(50).fill({ description: 'Something' }),
    selectedItems: [],
    word: '',
  };

  handleItemsSelected = selectedItems => {
    if (selectedItems.length !== this.state.selectedItems) {
      this.setState(() => ({ selectedItems }));
    }
  };

  render() {
    return (
      <div>
        <div>
          Some header
          {this.state.selectedItems.length ? <div>some icons</div> : null}
        </div>
        <input />
        <HighlightArea
          data={this.state.data}
          onItemsSelected={this.handleItemsSelected}
        />
      </div>
    );
  }
}

export default App;
