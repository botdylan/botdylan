var EventEmitter = require('events').EventEmitter
  , events = new EventEmitter();

module.exports = {
  on: function () {
    events.on.apply(events, arguments);
  }
, emit: function () {
    events.emit.apply(events, arguments);
  }
};
