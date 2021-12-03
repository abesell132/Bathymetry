module.exports = {
  // Land
  isRed: function (color) {
    let { r, g, b } = color;

    if (r == 255 && g == 0 && b == 0) {
      return true;
    } else {
      return false;
    }
  },

  //   Empty
  isGreen: function (color) {
    let { r, g, b } = color;

    if (r == 0 && g == 255 && b == 0) {
      return true;
    } else {
      return false;
    }
  },

  //   Water
  isBlue: function (color) {
    let { r, g, b } = color;

    if (r == 0 && g == 0 && b == 255) {
      return true;
    } else {
      return false;
    }
  },

  //   Depth Number
  isLightBlue: function (color) {
    let { r, g, b } = color;
    if (r == 0 && g == 255 && b == 255) {
      return true;
    } else {
      return false;
    }
  },

  //   Depth Lines
  isYellow: function (color) {
    let { r, g, b } = color;

    if (r == 255 && g == 255 && b == 0) {
      return true;
    } else {
      return false;
    }
  },
};
