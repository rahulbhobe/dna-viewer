import React from 'react';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactGridLayout from 'react-grid-layout';


class GridLayout extends React.Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };

  getVisibleLayout () {
    return this.props.layout.filter(({v}) => {
      return v === true;
    });
  };

  getLayout () {
    return this.getVisibleLayout().map(({i, x, y, w, h}) => {
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

    var layout = this.getLayout();
    return (
      <ReactGridLayout layout={layout} {...properties} >
        {this.props.children.map((child) => {
          return (
            <div key={child.key} >
              {child}
            </div>
          );
        })}
      </ReactGridLayout>
      );
  };
};

export default GridLayout;
