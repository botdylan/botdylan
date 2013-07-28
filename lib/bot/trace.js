module.exports = function (options) {
  return function trace(message) {
    if (!options.silent) {
      console.log(message);
    }
  };
};
