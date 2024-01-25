const net = require('net');
const { createZoneNameRequest, createZoneStatusRequest } = require('./ZoneRequests.js');
const { parseZoneNames, parseZoneData } = require('./ZoneUtils.js');

const HOST = '192.168.1.143';
const PORT = 9005;
const POLL_INTERVAL = 10000; // Adjust as necessary

function queryZoneStatus(zoneNames) {
    const client = new net.Socket();
    const message = createZoneStatusRequest();

    client.connect(PORT, HOST, () => {
        console.log('Connected to AirTouch 5');
        client.write(message);
    });

    client.on('data', (data) => {
        let zoneStatuses = parseZoneData(data);
        zoneStatuses.forEach(zone => {
            zone.zoneName = zoneNames[zone.zoneNumber];
        });

        let output = {
            results: [
                {
                    Zones: zoneStatuses
                }
            ]
        };
        console.log(JSON.stringify(output, null, 2));
        client.destroy();
    });

    client.on('close', () => {
        console.log('Connection closed');
    });

    client.on('error', (err) => {
        console.error('Connection error:', err);
        client.destroy();
    });
}

function queryZoneNames() {
    const client = new net.Socket();
    const message = createZoneNameRequest();

    client.connect(PORT, HOST, () => {
        console.log('Connected to AirTouch 5 for Zone Names');
        client.write(message);
    });

    client.on('data', (data) => {
        let zoneNames = parseZoneNames(data);
        queryZoneStatus(zoneNames);
        client.destroy();
    });

    client.on('close', () => {
        console.log('Connection closed');
    });

    client.on('error', (err) => {
        console.error('Connection error:', err);
        client.destroy();
    });
}

setInterval(queryZoneNames, POLL_INTERVAL);
