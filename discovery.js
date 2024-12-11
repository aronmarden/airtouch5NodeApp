const dgram = require('dgram');

// UDP broadcast message and port
const BROADCAST_MESSAGE = "::REQUEST-POLYAIRE-AIRTOUCH-DEVICE-INFO:;";
const BROADCAST_PORT = 49005;

// Create a UDP socket
const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

// Event listener for incoming messages
socket.on('message', (msg, rinfo) => {
    console.log("Received response from device:");
    console.log(`IP Address: ${rinfo.address}`);
    console.log(`Message: ${msg.toString()}`);
});

// Event listener for errors
socket.on('error', (err) => {
    console.error("Socket error:", err);
    socket.close();
});

// Bind the socket to the broadcast port
socket.bind(BROADCAST_PORT, () => {
    console.log(`Listening for responses on port ${BROADCAST_PORT}...`);

    // Enable broadcast after binding
    socket.setBroadcast(true);

    // Send the broadcast message
    const messageBuffer = Buffer.from(BROADCAST_MESSAGE);
    console.log("Sending discovery message...");

    socket.send(messageBuffer, 0, messageBuffer.length, BROADCAST_PORT, '255.255.255.255', (err) => {
        if (err) {
            console.error("Error sending broadcast message:", err);
            socket.close();
        } else {
            console.log("Discovery message sent.");
        }
    });
});
