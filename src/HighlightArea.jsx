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

  /**
   * @description - Determine where the dragging starts (the x,y coordinate)
   */
  onMouseDown = e => {
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

  /**
   * @description - Dragging is done, remove all event listeners and reset all necessary state
   */
  mouseUp = e => {
    console.log('mouse up');
    window.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('mouseup', this.mouseUp);
    this.setState(() => ({ ...this.initialState }));
  };

  calculateSelectionBox = (startPoint, endPoint) => {
    const left =
      Math.min(startPoint.x, endPoint.x) - this.parentNode.offsetLeft;
    const top = Math.min(startPoint.y, endPoint.y) - this.parentNode.offsetTop;
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
    console.log('e', e.pageX, e.pageY);
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

  render() {
    const { children } = this.props;
    if (typeof children !== 'function') {
      throw new Error('Only accepts a render prop');
    }
    return (
      <div ref={el => (this.parentNode = el)} onMouseDown={this.onMouseDown}>
        {this.renderHighlightBox()}
        {children()}
      </div>
    );
  }
}
