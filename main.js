const net = require('net');
const fs = require('fs');
const path = require('path');
const client = new net.Socket();
const keysFilePath = path.join(__dirname, 'keys.json');
const keys = JSON.parse(fs.readFileSync(keysFilePath, 'utf8'));
// const parseZoneStatus = require('./lib/parseZoneStatus.js');
const {parser} = require('./lib'); // Adjust the path as necessary
const {requester} = require('./lib'); // Adjust the path as necessary
// const createZoneStatusRequest = require('./lib/request/zoneStatus.js');
const { postToNewRelic } = require('./newRelicPost.js'); // Adjust the path as necessary

const HOST = keys.HOST; // AirTouch 5 IP address
const PORT = keys.PORT; // Default port for AirTouch 5 is 9005
const API_KEY = keys.API_KEY; // Replace with your New Relic API key
const ACCOUNT_ID = keys.ACCOUNT_ID; // Replace with your New Relic Account ID

function connectAndLoop() {
    client.connect(PORT, HOST, () => {
        console.log('Connecting to AirTouch 5 at ' + HOST + ':' + PORT);
        const message = requester.acZoneStatus();
        client.write(message);

        client.on('data', (data) => {
            console.dir(`Transmitted Binary: ${message.toString('hex')}`);
            console.dir(`Received Binary: ${data.toString('hex')}`);

            // Parse the response and output as JSON
            const result = parser.acZoneStatus(data);

            // Send the result to New Relic
            postToNewRelic(result, API_KEY, ACCOUNT_ID)
                .then(response => {
                    console.log('Response from New Relic:', response);
                    // Wait for 30 seconds before sending a new request
                    setTimeout(() => {
                        client.write(request());
                    }, 5000);
                })
                .catch(error => console.error('Error sending to New Relic:', error));
        });

        // Handle app termination
        process.on('SIGINT', () => {
            console.log('App terminated. Closing TCP connection...');
            client.end();
            process.exit();
        });

        client.on('error', (err) => {
            console.error('Connection error:', err.message);
        });
    });
}

connectAndLoop();
