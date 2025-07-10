// lib/sniffer.js
const Cap = require('cap').Cap;
const decoders = require('cap').decoders;
const PROTOCOL = decoders.PROTOCOL;

function start(interfaceName, onPacket) {
  const c = new Cap();
  const device = Cap.findDevice(interfaceName);
  const filter = 'ip and tcp';
  const bufSize = 10 * 1024 * 1024;
  const buffer = Buffer.alloc(65535);

  const linkType = c.open(device, filter, bufSize, buffer);
  c.setMinBytes && c.setMinBytes(0);

  c.on('packet', (nbytes, trunc) => {
    if (linkType === 'ETHERNET') {
      const ret = decoders.Ethernet(buffer);
      if (ret.info.type === PROTOCOL.ETHERNET.IPV4) {
        const ip = decoders.IPV4(buffer, ret.offset);
        if (ip.info.protocol === PROTOCOL.IP.TCP) {
          const tcp = decoders.TCP(buffer, ip.offset);
          const packet = {
            src_ip: ip.info.srcaddr,
            dst_ip: ip.info.dstaddr,
            src_port: tcp.info.srcport,
            dst_port: tcp.info.dstport,
            length: ip.info.totallen
          };
          onPacket(packet);
        }
      }
    }
  });
}

module.exports = { start };
