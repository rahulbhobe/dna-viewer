var Utils = {};

Utils.assert = function (condition, message) {
  if (!condition) {
    message = message || "Assertion failed";

    if (typeof Error !== "undefined") {
      throw new Error(message);
    }
    throw message;
  }
};

Utils.errorObject = function (msg, indices) {
  return {
    hasErrors: function() {
      return msg;
    },

    getErrorIndices: function() {
      return indices;
    }
  };
};

module.exports = Utils;
