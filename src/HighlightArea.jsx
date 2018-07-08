import React, { Component } from 'react';

export default class HighlightArea extends Component {
  state = {
    mouseDown: false,
    startPoint: null,
    endPoint: null,
    selectionBox: null,
  };
  get initialState() {
    return {
      mouseDown: false,
      startPoint: null,
      endPoint: null,
      selectionBox: null,
    };
  }

  refCollection = [];
  selectedBools = [];
  selectedItems = [];

  componentDidUpdate() {
    if (this.state.mouseDown && this.state.selectionBox) {
      this._updateCollision(this.state.selectionBox);
    }
  }

  _updateCollision = selectionBox => {
    this.refCollection.forEach((node, index) => {
      const nodeBox = {
        top: node.offsetTop,
        left: node.offsetLeft,
        width: node.clientWidth,
        height: node.clientHeight,
      };
      if (this._intersects(selectionBox, nodeBox)) {
        this.selectedBools[index] = true;
      } else {
        this.selectedBools[index] = false;
      }
    });
  };

  _intersects = (boxA, boxB) => {
    if (
      boxA.left <= boxB.left + boxB.width &&
      boxA.left + boxA.width >= boxB.left &&
      boxA.top <= boxB.top + boxB.height &&
      boxA.top + boxA.height >= boxB.top
    ) {
      return true;
    }
    return false;
  };

  /**
   * @description - Determine where the dragging starts (the x,y coordinate)
   */
  mouseDown = e => {
    e.persist();
    if (e.button !== 0 && e.nativeEvent.which !== 0) {
      return;
    }
    this.setState(() => ({
      mouseDown: true,
      startPoint: {
        x: e.pageX,
        y: e.pageY,
      },
    }));
    // act of dragging
    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('mouseup', this.mouseUp);
  };

  _resetSelectedBools = () =>
    (this.selectedBools = this.selectedBools.map(() => false));

  /**
   * @description - Dragging is done, remove all event listeners and reset all necessary state
   */
  mouseUp = e => {
    window.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('mouseup', this.mouseUp);
    // did not move, clicked in place
    if (!this.state.selectionBox) {
      this.itemsSelected = [];
      this.props.onItemsSelected([]);
      this._resetSelectedBools();
    }
    this.setState(() => ({ ...this.initialState }));
    const itemsSelected = [];
    this.selectedBools.forEach((bool, index) => {
      if (bool) {
        itemsSelected.push(this.props.data[index]);
      }
    });
    this.selectedItems = itemsSelected;
    this.props.onItemsSelected(itemsSelected);
  };

  calculateSelectionBox = (startPoint, endPoint) => {
    const left = Math.min(startPoint.x, endPoint.x);
    const top = Math.min(startPoint.y, endPoint.y);
    const width = Math.abs(startPoint.x - endPoint.x);
    const height = Math.abs(startPoint.y - endPoint.y);
    const coords = {
      left: left,
      top: top,
      width: width,
      height: height,
    };
    return coords;
  };

  mouseMove = e => {
    const endPoint = {
      x: e.pageX,
      y: e.pageY,
    };
    this.setState(() => ({
      endPoint,
      selectionBox: this.calculateSelectionBox(this.state.startPoint, endPoint),
    }));
  };

  renderHighlightBox = () => (
    <div
      style={{
        ...this.state.selectionBox,
        background: 'rgba(0, 162, 255, 0.4)',
        position: 'absolute',
        zIndex: 1000,
      }}
    />
  );

  handleClick = selectedIndex => {
    const selectedItems = [this.props.data[selectedIndex]];
    this.props.onItemsSelected(selectedItems);
    this.selectedBools = this.selectedBools.map(
      (bool, index) => (selectedIndex === index ? true : false),
    );
    this.itemsSelected = selectedItems;
  };

  render() {
    return (
      <div onMouseDown={this.mouseDown} ref={el => (this.parentNode = el)}>
        {this.renderHighlightBox()}
        <div
          style={{
            display: 'grid',
            gridGap: 50,
            gridTemplateColumns: 'repeat(9, 100px)',
          }}
        >
          {this.props.data.map(({ description }, index) => (
            <div
              key={`${description}-${index}`}
              onClick={() => this.handleClick(index)}
              style={{
                userSelect: 'none',
                backgroundColor: this.selectedBools[index] ? 'blue' : 'white',
                border: '1px solid black',
                height: 100,
              }}
              ref={el => (this.refCollection[index] = el)}
            >
              {description}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
