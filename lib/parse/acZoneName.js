//Zone Name (0xFF 0x13) Parsing Function
//This function processes the zone name data, providing the name for each zone.

function parseZoneName(data) {
    const zoneNames = [];
    let index = 20; // Skip the first 10 unknown payload bytes and 10 header bytes

    // Skip the sub message type and other bytes (8 bytes)
    index += 8;

    // Loop through the data
    while (index < data.length) {
        const zoneNumber = data[index];
        const nameLength = data[index + 1];
        const nameBytes = data.slice(index + 2, index + 2 + nameLength);
        const zoneName = Buffer.from(nameBytes).toString('utf-8');

        zoneNames.push({
            zoneNumber,
            zoneName,
            eventType: 'airTouch5Event',
            request: 'zoneName0xFF13',
            debugHEX: data.toString('hex'),
            timestamp: Math.floor(Date.now())
        });

        index += 2 + nameLength;
    }

    return zoneNames; // Return just the inner JSON structures
}

module.exports = parseZoneName;
