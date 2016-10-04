
class Dimensions {
  static DNA_VIEWER_ROW_HEIGHT = 32;
  static SETTINGS_VIEW_WIDTH   = 300;

  static isWidthSmall () {
    return (window.innerWidth < 900);
  };

  static isHeightSmall () {
    return (window.innerHeight < 650);
  };

  static calculateCanvasDimensions () {
    var winW = window.innerWidth;
    var winH = window.innerHeight;

    return {
      width:  this.isWidthSmall()  ? winW  : winW - this.SETTINGS_VIEW_WIDTH,
      height: this.isHeightSmall() ? (winH - (this.DNA_VIEWER_ROW_HEIGHT * (1))) : winH - (this.DNA_VIEWER_ROW_HEIGHT * (1+4))
    };
  };
};

export default Dimensions;