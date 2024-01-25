const { createMessage } = require('./ZoneUtils');

function createZoneNameRequest() {
    const header = Buffer.from([0x55, 0x55, 0x55, 0xAA]);
    const address = Buffer.from([0x90, 0xB0]);
    const messageId = Buffer.from([0x02]); // Example message ID
    const messageType = Buffer.from([0x1F]);
    const length = Buffer.from([0x00, 0x02]);
    const subType = Buffer.from([0xFF, 0x13]); // Request all zones' names
    return createMessage(header, address, messageId, messageType, length, subType);
}

function createZoneStatusRequest() {
    const header = Buffer.from([0x55, 0x55, 0x55, 0xAA]);
    const address = Buffer.from([0x80, 0xB0]);
    const messageId = Buffer.from([0x01]); // Example message ID
    const messageType = Buffer.from([0xC0]);
    const length = Buffer.from([0x00, 0x08]);
    const subType = Buffer.from([0x21, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    return createMessage(header, address, messageId, messageType, length, subType);
}

module.exports = {
    createZoneNameRequest,
    createZoneStatusRequest
};
