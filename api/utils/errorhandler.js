const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  Error.captureStackTrace(error, createError);
  return error;
};
export default createError;

// class ErrorHandler extends Error {
//     constructor(message, statusCode) {
//         super(message);
//         this.statusCode = statusCode;

//         // Capture the stack trace
//         Error.captureStackTrace(this, this.constructor);
//     }
// }

// module.exports = ErrorHandler;
