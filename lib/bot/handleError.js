module.exports = function (options) {
  /**
   * Curries a function and handles errors for us
   *
   * @param {Function} fn
   * @return {Function}
   */
  return function handleError(fn) {
    return function (error) {
      if (error && !options.silent) {
        console.error(error);
      }
      fn.apply(this, [].slice.apply(arguments, [1]));
    }
  };
};
