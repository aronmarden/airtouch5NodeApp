//Console Version (0xFF 0x30) Parsing Function
//This function processes the console version data, providing the version information of the AirTouch console.

function parseConsoleVersion(data) {
    let index = 20; // Skip the first 10 unknown payload bytes and 10 header bytes

    // Skip the sub message type and other bytes (8 bytes)
    index += 8;

    // Check if there's enough data for the console version information
    if (index + 2 <= data.length) {
        const updateSign = data[index];
        const versionStringLength = data[index + 1];
        const versionStringBytes = data.slice(index + 2, index + 2 + versionStringLength);
        const versionString = Buffer.from(versionStringBytes).toString('utf-8');

        return {
            updateAvailable: updateSign !== 0,
            versionString,
            eventType: 'airTouch5Event',
            request: 'consoleVersion0xFF30',
            debugHEX: data.toString('hex'),
            timestamp: Math.floor(Date.now())
        };
    }

    return null; // Return null if data is insufficient
}

module.exports = parseConsoleVersion;
