const sniffer = require('./sniffer');
const { updateFlow } = require('./features');

let isSniffing = false;

function startSniffing(options, alertCallback) {
  if (isSniffing) return;

  const iface = options.interface || 'Ethernet';
  console.log(`[+] Sniffing on interface: ${iface}`); // a print statement for understanding

  sniffer.start(iface, (packet) => {
    const flow = updateFlow(packet);
    if (flow) {
      console.log('[*] Flow built:', flow);
      // 🔜 Later we'll pass this to ML predictor here
      alertCallback(flow); // For now, treat it as alert will add more logic for IR later 
    }
  });

  isSniffing = true;
}

function stopSniffing() {
  isSniffing = false;
  console.log('[!] Sniffing stopped.');
}

module.exports = { startSniffing, stopSniffing };
