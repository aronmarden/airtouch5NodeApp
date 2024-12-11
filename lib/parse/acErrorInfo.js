//AC Error Information (0xFF 0x10) Parsing Function
//This function processes the AC error information, providing details about any reported errors for each AC unit.

function parseACErrorInfo(data) {
    const acErrors = [];
    let index = 20; // Skip the first 10 unknown payload bytes and 10 header bytes

    // Skip the sub message type and other bytes (8 bytes)
    index += 8;

    // Loop through the data
    while (index < data.length) {
        const acNumber = data[index];
        const errorInfoLength = data[index + 1];

        // Check for the presence of an error message
        if (errorInfoLength > 0) {
            const errorInfoBytes = data.slice(index + 2, index + 2 + errorInfoLength);
            const errorInfo = errorInfoBytes.map(byte => String.fromCharCode(byte)).join('');

            acErrors.push({
                acNumber,
                errorInfo,
                eventType: 'airTouch5Event',
                request: 'acError0xFF10',
                debugHEX: data.toString('hex'),
                timestamp: Math.floor(Date.now())
            });
        }

        index += 2 + errorInfoLength;
    }

    return acErrors; // Return just the inner JSON structures
}

module.exports = parseACErrorInfo;
