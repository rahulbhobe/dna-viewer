import React from 'react';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactGridLayout from 'react-grid-layout';


class GridLayout extends React.Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };

  getKeyFromIndex (idx) {
    return 'grid_layout_key_' + idx;
  };

  getVisibleLayout () {
    return this.props.layout.filter(({v}) => {
      return v === true;
    });
  };

  getLayout () {
    return this.getVisibleLayout().map(({x, y, w, h}, idx) => {
      var i = this.getKeyFromIndex(idx);
      return {i, x, y, w, h};
    });
  };

  render () {
    var properties = {
      className: "layout",
      isDraggable: false,
      isResizable: false,
      margin: [0, 0],
      verticalCompact: false,
      ...this.props.properties
    };

    return (
      <ReactGridLayout layout={this.getLayout()} {...properties} >
        {this.getVisibleLayout().map((item, idx) => {
          return (
            <div key={this.getKeyFromIndex(idx)} >
              {item.d}
            </div>
          );
        })}
      </ReactGridLayout>
      );
  };
};

export default GridLayout;
