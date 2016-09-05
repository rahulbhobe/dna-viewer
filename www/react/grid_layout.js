import React from 'react';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactGridLayout from 'react-grid-layout';


class GridLayout extends React.Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };

  getLayout () {
    return this.props.layout.map(({i, x, y, w, h}) => {
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
        {this.props.layout.map((item) => {
          return (
            <div key={item.i} >
              {item.v ? item.d : null}
            </div>
          );
        })}
      </ReactGridLayout>
      );
  };
};

export default GridLayout;
