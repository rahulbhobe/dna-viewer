
function assert(condition, message) {
  if (!condition) {
    message = message || "Assertion failed";

    if (typeof Error !== "undefined") {
      throw new Error(message);
    }
    throw message;
  }
};

var errorObject = function(msg) {
  return {
    hasErrors: function() {
      return msg;
    },

    getError: function() {
      return msg;
    }
  };
};
