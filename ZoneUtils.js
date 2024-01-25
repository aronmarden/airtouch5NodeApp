const crc = require('crc');

function createMessage(header, address, messageId, messageType, length, subType) {
    let message = Buffer.concat([header, address, messageId, messageType, length, subType]);
    const crcValue = crc.crc16modbus(message.slice(4));
    let crcBuffer = Buffer.alloc(2);
    crcBuffer.writeUInt16BE(crcValue, 0);
    return Buffer.concat([message, crcBuffer]);
}

function parseZoneNames(data) {
    let zoneNames = {};
    let index = 16; // Start index for zone name data
    while (index < data.length) {
        let zoneNumber = data[index++];
        let nameLength = data[index++];
        zoneNames[zoneNumber] = data.toString('utf8', index, index + nameLength);
        index += nameLength;
    }
    return zoneNames;
}

function parseZoneData(data) {
    const startIndex = 16; // Adjust based on the message format
    const zoneDataLength = 8; // Each zone's data is 8 bytes long
    let zoneStatuses = [];

    for (let i = startIndex; i < data.length; i += zoneDataLength) {
        const zoneData = data.slice(i, i + zoneDataLength);
        const zoneNumber = zoneData[1] & 0x0F;
        const openPercentage = zoneData[3];
        const temperature = (zoneData[7] - 500) / 10; // Extracting temperature
        zoneStatuses.push({
            zoneNumber: zoneNumber,
            openPercentage: openPercentage,
            temperature: temperature
        });
    }

    return zoneStatuses;
}

module.exports = {
    createMessage,
    parseZoneNames,
    parseZoneData
};
