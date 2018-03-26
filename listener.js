"use strict";

/**
 * Requiring necessary modules
 */
var net = require('net'),
    fs = require('fs');

/**
 * Host IP and Port
 */
let PORT = 1101;


/**
 * Creating the TCP Listener 
 */
net.createServer(function (sock) {
    "use strict";

    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

    /**
     * On receiving data through the TCP channel
     */
    sock.on('data', function (data) {

        let now = (new Date()).toISOString();
        let incomingMsg = data.toString();

        //logging the incoming traffic
        console.log(`${now}\t${sock.remoteAddress}: ${data}\n`);

        if (incomingMsg.indexOf("ServerLogin") > -1) {
            console.log("server login....");
        } else if (incomingMsg.indexOf("ping") > -1) {
            console.log("not interesting....");
        } else {

        }
        /**
         * Write back message
         */
        // sock.write(Buffer.from('01', 'hex'));
    });

    /**
     * Socket Termination Listener
     */
    sock.on('close', function (data) {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });



}).listen(PORT);


console.log('Server listening on ' + HOST + ':' + PORT + ' for Falcom');

