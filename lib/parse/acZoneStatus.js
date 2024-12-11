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
            request: 'zoneStatus0x21',
            debugHEX: data.toString('hex'),
            timestamp: Math.floor(Date.now())
            // timestamp: Math.floor(Date.now() / 60000) * 60000, // Epoch time at the top of the minute
        };
        zones.push(zone);
        index += 8;
    }

    return zones; // Return just the inner JSON structures
}

module.exports = parseZoneStatus;