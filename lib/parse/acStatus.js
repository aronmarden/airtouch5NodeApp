//AC Status (0x23) Parsing Function
//This function processes the AC status data, providing detailed information about each AC unit's current state.

function parseACStatus(data) {
    const acs = [];
    let index = 20; // Skip the first 10 unknown payload bytes and 10 header bytes

    // Skip the sub message type and other bytes (8 bytes)
    index += 8;

    // Assuming each AC's data is 10 bytes long
    while (index + 10 <= data.length) {
        const acData = data.slice(index, index + 10);

        const highByte = acData[8];
        const lowByte = acData[9];
        const combinedValue = (highByte << 8) | lowByte;

        const ac = {
            acPowerState: acData[0] >> 4,
            acNumber: acData[0] & 0x0F,
            acMode: acData[1] >> 4,
            acFanSpeed: acData[1] & 0x0F,
            setPoint: (acData[2] + 100) / 10,
            temperature: (combinedValue - 500) / 10,
            turbo: (acData[4] & 0x10) >> 4,
            bypass: (acData[4] & 0x08) >> 3,
            spill: (acData[4] & 0x04) >> 2,
            timerStatus: (acData[4] & 0x02) >> 1,
            error: acData[7],
            eventType: 'airTouch5Event',
            request: 'acStatus0x23',
            debugHEX: data.toString('hex'),
            timestamp: Math.floor(Date.now())
        };
        acs.push(ac);
        index += 10;
    }

    return acs; // Return just the inner JSON structures
}

module.exports = parseACStatus;
