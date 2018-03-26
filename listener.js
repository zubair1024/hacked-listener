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
let threshold = 29;
let above = false;


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
            if (incomingMsg.indexOf('*') > -1) {
                let chunks = incomingMsg.split('*');
                for (let i = 0; i < chunks.length; i++) {
                    let message = chunks[i];
                    message = message.replace("\r\n", "");
                    if (message !== '') {
                        if (message.indexOf(',') > -1) {
                            let splitData = message.split(',');
                            let date = splitData[0];
                            let time = splitData[1];
                            let value = splitData[2];
                            console.log(`DATA: ${date}, ${time}, ${value}`);
                            value = value.replace('\r\n', '');
                            let convertedValue = parseFloat(value);
                            if (!(convertedValue == 85)) {
                                if (convertedValue >= threshold) {
                                    above = true;
                                    console.log(`Command sent: ${value} higher than threshold at ${date} ${time}`);
                                    sock.write('$PFAL,Sys.Trigger0=high\r\n');
                                } else if ((convertedValue < threshold) && above) {
                                    above = false;
                                    console.log(`Command sent:  ${value} lower than threshold at ${date} ${time}`);
                                    sock.write('$PFAL,Sys.Trigger1=high\r\n');
                                }
                            }
                        }
                    } else {
                        //do nothing
                    }
                }
            }else{
                console.log(`Incomplete message: ${incomingMsg}`);
            }
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

    sock.on('error', function (data) {
        console.error(data);
    });



}).listen(PORT);


console.log('Server listening on ' + PORT);

