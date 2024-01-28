const net = require('net');
const { postToNewRelic } = require('./newRelicPost.js'); // Adjust the path as necessary
const fs = require('fs');
const path = require('path');
const client = new net.Socket();
const keysFilePath = path.join(__dirname, 'keys.json');
const keys = JSON.parse(fs.readFileSync(keysFilePath, 'utf8'));

const HOST = keys.HOST; // AirTouch 5 IP address
const PORT = keys.PORT; // Default port for AirTouch 5 is 9005
const API_KEY = keys.API_KEY; // Replace with your New Relic API key
const ACCOUNT_ID = keys.ACCOUNT_ID; // Replace with your New Relic Account ID

function parseZoneStatus(data) {
    const zones = [];
    let index = 20; // Skip the first 10 unknown payload bytes and 10 header bytes

    // Skip the sub message type and other bytes (8 bytes)
    index += 8;

    // Assuming each zone's data is 8 bytes long
    while (index + 8 <= data.length) {
        const zoneData = data.slice(index, index + 8);

        const highByte = zoneData[4];
        const lowByte = zoneData[5];
        const combinedValue = (highByte << 8) | lowByte;

        const zone = {
            zoneNumber: zoneData[0] & 0x3F,
            powerState: zoneData[0] >> 6,
            controlMethod: zoneData[1] >> 7,
            openPercentage: zoneData[1] & 0x7F,
            setPoint: (zoneData[2] + 100) / 10,
            temperature: (combinedValue - 500) / 10,
            spill: (zoneData[6] & 0x02) >> 1,
            lowBattery: zoneData[6] & 0x01,
            eventType: 'airTouch5Event',
            request: 'zoneStatus0x21'
        };
        zones.push(zone);
        index += 8;
    }

    return zones; // Return just the inner JSON structures
}

function createZoneStatusRequest() { //as per API documentation for binary request 0x21
    const header = Buffer.from([0x55, 0x55, 0x55, 0xAA]);
    const address = Buffer.from([0x80, 0xB0]);
    const messageId = Buffer.from([0x01]); 
    const messageType = Buffer.from([0xC0]);
    const dataLength = Buffer.from([0x00, 0x08]);
    const subMessage = Buffer.from([0x21, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

    return Buffer.concat([header, address, messageId, messageType, dataLength, subMessage]);
}

client.connect(PORT, HOST, () => {
    console.log('Connecting to AirTouch 5 at ' + HOST + ':' + PORT);
    const message = createZoneStatusRequest();
    console.log(message);
    client.write(message);
});

client.on('data', (data) => {
    console.log('Received data:', data.toString('hex'));

    // Parse the response and output as JSON
    const result = parseZoneStatus(data);
    console.log('Parsed Response:', JSON.stringify(result, null, 2));

    // Send the result to New Relic
    postToNewRelic(result, API_KEY, ACCOUNT_ID)
        .then(response => console.log('Response from New Relic:', response))
        .then(data => console.log('PayloadSent:', data))
        .catch(error => console.error('Error sending to New Relic:', error));

    client.end(); // Graceful Close
});

client.on('close', () => {
    console.log('Connection closed');
});

client.on('error', (err) => {
    console.error('Connection error:', err.message);
});
