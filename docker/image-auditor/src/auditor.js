/**
 * This program simulates someone who listens to the orchestra.
 * This application has two responsibilities. Firstly, it must listen to Musicians and
 * keep track of active musicians. A musician is active if it has played a sound during the
 * last 5 seconds. Secondly, it must make this information available to you.
 * Concretely, this means that it should implement a very simple TCP-based protocol.

 * Usage: node auditor.js
 */

// Let's define protocol properties
const PROTOCOL_PORT = 2205;
const PROTOCOL_MULTICAST_ADDRESS = '239.255.22.5';

// Time in seconds for a musician to be active
const ACTTIVE_DELAY = 5;

// We use standard Node.js module to work with UDP
const dgram = require('dgram');

// We use standard Node.js module to work with TCP
const net = require('net');

// We use npm package to manipulate and display dates
const moment = require('moment');

// We use a dictionary to store active musicians.
const activeMusicians = new Map();

/**
 * Let's create a datagram socket. We will use it to listen for datagrams published in the
 * multicast group by musicians.
 */
const s = dgram.createSocket('udp4');
s.bind(PROTOCOL_PORT, () => {
  console.log('[UDP] - Joining multicast group');
  s.addMembership(PROTOCOL_MULTICAST_ADDRESS);
});

// This callback is invoked when a new datagram has arrived.
s.on('message', (msg, source) => {
  console.log(`[UDP] - Data has arrived: ${msg}. Source port: ${source.port}`);

  // Parse msg and create a javascript object
  const dtg = JSON.parse(msg);

  // Add musician to activeMusicians. It the musician already exists, we update activeSince
  const musician = {
    uuid: dtg.uuid,
    instrument: dtg.instrument,
    activeSince: moment().toISOString(),
  };

  activeMusicians.set(musician.uuid, musician);
});

// Let's create a new TCP server and start listening for connections
const server = net.createServer();
server.listen(PROTOCOL_PORT, 'localhost', () => {
  console.log(`[TCP] - Server is running on port ${PROTOCOL_PORT}.`);
});

// Send active musician when a new connection is made
server.on('connection', (socket) => {
  console.log('[TCP] - New connection');

  const payload = [];

  activeMusicians.forEach((value, key) => {
    // Check if musician is active
    if (moment().diff(value.activeSince, 'seconds') > ACTTIVE_DELAY) {
      activeMusicians.delete(key);
    } else {
      payload.push(value);
    }
  });

  // Send active musicians and close the socket
  socket.end(JSON.stringify(payload));
});
