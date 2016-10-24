var ErrorUtils = {};

ErrorUtils.assert = function (condition, message) {
  if (!condition) {
    message = message || "Assertion failed";

    if (typeof Error !== "undefined") {
      throw new Error(message);
    }
    throw message;
  }
};

ErrorUtils.errorObject = function (msg, index) {
  return {
    hasErrors: function() {
      return msg;
    },

    getErrorIndex: function() {
      return index;
    }
  };
};

export default ErrorUtils;
