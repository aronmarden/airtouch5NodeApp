//AC Control (0x22) Parsing Function
//This function processes the AC control data by slicing the appropriate bytes and interpreting them according to the protocol. It returns an array of objects, each representing the control state of an AC.

function parseACControl(data) {
    const acs = [];
    let index = 20; // Skip the first 10 unknown payload bytes and 10 header bytes

    // Skip the sub message type and other bytes (8 bytes)
    index += 8;

    // Assuming each AC's data is 4 bytes long
    while (index + 4 <= data.length) {
        const acData = data.slice(index, index + 4);

        const ac = {
            acNumber: acData[1] & 0x0F,
            powerSetting: acData[0] >> 4,
            acMode: (acData[1] >> 4) & 0x0F,
            acFanSpeed: acData[2] & 0x0F,
            setPointControl: acData[3],
            eventType: 'airTouch5Event',
            request: 'acControl0x22',
            debugHEX: data.toString('hex'),
            timestamp: Math.floor(Date.now())
        };
        acs.push(ac);
        index += 4;
    }

    return acs; // Return just the inner JSON structures
}

module.exports = parseACControl;
