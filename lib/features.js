// lib/features.js
const flows = {};  // key = src_ip + dst_ip + port, value = stats

function updateFlow(packet) {
  const {
    src_ip, dst_ip, src_port, dst_port, protocol = 'TCP'
  } = packet;

  const key = `${src_ip}:${src_port}->${dst_ip}:${dst_port}`;

  if (!flows[key]) {
    flows[key] = {
      src_ip,
      dst_ip,
      src_port,
      dst_port,
      protocol,
      timestamps: [],
      total_size: 0,
      packet_count: 0,
      first_seen: Date.now()
    };
  }

  const flow = flows[key];
  flow.packet_count += 1;
  flow.total_size += packet.length || 1;
  flow.timestamps.push(Date.now());

  // If enough packets captured, build feature obj and return it
  if (flow.packet_count >= 5) {
    const duration = (Date.now() - flow.first_seen) / 1000;
    const avg_pkt_size = flow.total_size / flow.packet_count;

    const feature = {
      src_ip,
      dst_ip,
      src_port,
      dst_port,
      protocol,
      packet_count: flow.packet_count,
      avg_pkt_size: parseFloat(avg_pkt_size.toFixed(2)),
      duration: parseFloat(duration.toFixed(2))
    };

    // reset flow
    delete flows[key];
    return feature;
  }

  return null;
}

module.exports = { updateFlow };
