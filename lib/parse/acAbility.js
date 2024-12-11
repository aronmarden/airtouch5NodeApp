//AC Ability (0xFF 0x11) Parsing Function
// This function processes the AC ability data, extracting detailed capabilities of each AC unit.

function parseACAbility(data) {
    const acAbilities = [];
    let index = 20; // Skip the first 10 unknown payload bytes and 10 header bytes

    // Skip the sub message type and other bytes (8 bytes)
    index += 8;

    // Loop through the data
    while (index < data.length) {
        const acNumber = data[index + 2];
        const dataLength = data[index + 3];
        const endIndex = index + 4 + dataLength;

        if (endIndex > data.length) break;

        const acNameBytes = data.slice(index + 4, index + 20);
        const acName = acNameBytes.filter(byte => byte !== 0).map(byte => String.fromCharCode(byte)).join('');

        const acAbility = {
            acNumber,
            acName,
            startZoneNumber: data[index + 20],
            zoneCount: data[index + 21],
            modes: {
                cool: (data[index + 22] & 0x10) >> 4,
                fan: (data[index + 22] & 0x08) >> 3,
                dry: (data[index + 22] & 0x04) >> 2,
                heat: (data[index + 22] & 0x02) >> 1,
                auto: data[index + 22] & 0x01,
            },
            fanSpeeds: {
                intelligentAuto: (data[index + 23] & 0x80) >> 7,
                turbo: (data[index + 23] & 0x40) >> 6,
                powerful: (data[index + 23] & 0x20) >> 5,
                high: (data[index + 23] & 0x10) >> 4,
                medium: (data[index + 23] & 0x08) >> 3,
                low: (data[index + 23] & 0x04) >> 2,
                quiet: (data[index + 23] & 0x02) >> 1,
                auto: data[index + 23] & 0x01,
            },
            minCoolSetPoint: data[index + 24],
            maxCoolSetPoint: data[index + 25],
            minHeatSetPoint: data[index + 26],
            maxHeatSetPoint: data[index + 27],
            eventType: 'airTouch5Event',
            request: 'acAbility0xFF11',
            debugHEX: data.toString('hex'),
            timestamp: Math.floor(Date.now())
        };

        acAbilities.push(acAbility);
        index = endIndex;
    }

    return acAbilities; // Return just the inner JSON structures
}

module.exports = parseACAbility;
