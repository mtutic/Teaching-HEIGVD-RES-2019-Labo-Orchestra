/*
 This program simulates someone who plays an instrument in an orchestra.
 When the app is started, it is assigned an instrument (piano, flute, etc.).
 As long as it is running, every second it will emit a sound
 (well... simulate the emission of a sound: we are talking about a communication protocol).
 Of course, the sound depends on the instrument.

 Usage: node musician.js instrument
*/

/**
 * Let's define protocol properties
 */
const PROTOCOL_PORT = 2525;
const PROTOCOL_MULTICAST_ADDRESS = 'localhost';

/**
 * We use a standard Node.js module to work with UDP
 */
const dgram = require('dgram');

/**
 * We use npm package for generating unique id
 */
const uuid = require('uuid/v1');

/**
 * Let's create a datagram socket. We will use it to send our UDP datagrams
 */
const s = dgram.createSocket('udp4');

/**
 * List of available instruments with their sound
 */
const listInstruments = {
  piano: 'ti-ta-ti',
  trumpet: 'pouet',
  flute: 'trulu',
  violin: 'gzi-gzi',
  drum: 'boum-boum',
};

/**
 * Let's define a javascript class for our musician. The constructor accepts
 * an instrument sdthat will be played by the musician
 */
function Musician(instrumentSound) {
  this.instrumentSound = instrumentSound;

  /**
   * We will simulate the musician who plays his instrument. That is something that
   * we implement in a class method (via the prototype)
   */
  Musician.prototype.update = function update() {
    const soundEmit = {
      sound: instrumentSound,
      uuid: uuid(),
    };
    const payload = JSON.stringify(soundEmit);

    /**
     * Finally, let's encapsulate the payload in a UDP datagram, which we publish on
     * the multicast address. All subscribers to this address will receive the message.
     */
    const message = Buffer.from(payload);
    s.send(message, 0, message.length, PROTOCOL_PORT, PROTOCOL_MULTICAST_ADDRESS, () => {
      console.log(`Sending payload: ${payload} via port ${s.address().port}`);
    });
  };

  /**
   * Let's take and send a sound every 1000 ms
   */
  setInterval(this.update.bind(this), 1000);
}

/**
 * Let's get the musician properties from the command line attributes
 */
if (process.argv.length < 3) {
  throw new Error('Number of arguments is not correct');
}

const m1 = new Musician(listInstruments[process.argv[2]]);
