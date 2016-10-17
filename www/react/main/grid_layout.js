import React from 'react';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactGridLayout from 'react-grid-layout';


class GridLayout extends React.Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };

  getVisibleLayout () {
    var filtered = this.props.layout.filter(({v}) => {
      return v === true;
    });

    return filtered.map(({i, x, y, w, h}) => {
      return {i, x, y, w, h};
    });
  };

  getVisibleKeys () {
    var layout = this.getVisibleLayout();
    return layout.reduce((acc, {i}) => {
      acc[i] = true;
      return acc;
    }, {});
  };

  getVisibleChildren () {
    var keys = this.getVisibleKeys();
    return this.props.children.filter(({key}) => {
      if (key === undefined) return false;
      if (key === null)      return false;
      return (key in keys);
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

    var layout = this.getVisibleLayout();
    return (
      <ReactGridLayout layout={layout} {...properties} >
        {this.getVisibleChildren().map((child) => {
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
