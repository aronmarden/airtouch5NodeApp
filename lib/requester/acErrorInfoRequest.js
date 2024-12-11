function createACErrorInfoRequest(acNumber) {
    const header = Buffer.from([0x55, 0x55, 0x55, 0xAA]);
    const address = Buffer.from([0x90, 0xB0]);
    const messageId = Buffer.from([0x01]);
    const messageType = Buffer.from([0x1F]);
    const dataLength = Buffer.from([0x00, 0x03]);
    const subMessage = Buffer.from([0xFF, 0x10, acNumber]);

    const messageWithoutCRC = Buffer.concat([header, address, messageId, messageType, dataLength, subMessage]);
    const crcBytes = calculateCRC16(messageWithoutCRC);

    return Buffer.concat([messageWithoutCRC, crcBytes]);
}

module.exports = createACErrorInfoRequest;
