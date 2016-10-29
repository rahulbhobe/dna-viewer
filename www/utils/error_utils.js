class ErrorUtils {
  static assert (condition, message) {
    if (!condition) {
      message = message || "Assertion failed";

      if (typeof Error !== "undefined") {
        throw new Error(message);
      }
      throw message;
    }
  };

  static errorObject (msg, index) {
    return {
      hasErrors: () => {
        return msg;
      },

      getErrorIndex: () => {
        return index;
      }
    };
  };
};

export default ErrorUtils;
