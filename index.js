// index.js
const EventEmitter = require('events');
const core = require('./lib/core');

class CipherWeb extends EventEmitter {
  start(options) {
    core.startSniffing(options, (alert) => {
      this.emit('alert', alert); // So users can listen to 'alert' events
    });
  }

  stop() {
    core.stopSniffing();
  }
}

module.exports = new CipherWeb();
