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

Utils.errorObject = function (msg) {
  return {
    hasErrors: function() {
      return msg;
    },

    getError: function() {
      return msg;
    }
  };
};

module.exports = Utils;
