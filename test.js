const cipherweb = require('./index');

cipherweb.on('alert', (data) => {
  console.log('⚠️ ALERT:', data);
});

cipherweb.start({
  interface: 'Ethernet' // change this if needed
});
