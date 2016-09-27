class Dimensions {
  static get DNA_VIEWER_ROW_HEIGHT() {
    return 32;
  };

  static get SETTINGS_VIEW_WIDTH() {
    return 300;
  };

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