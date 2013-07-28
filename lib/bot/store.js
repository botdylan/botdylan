var state = {};

/**
 * Dumb simple memory storage
 */
module.exports = function store(key, val) {
  if (val) {
    state[key] = val;
    this.emit('state.change', key, val);
  }

  return state[key];
};
