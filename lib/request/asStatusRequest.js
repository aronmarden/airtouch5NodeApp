function createACStatusRequest() {
    const header = Buffer.from([0x55, 0x55, 0x55, 0xAA]);
    const address = Buffer.from([0x80, 0xB0]);
    const messageId = Buffer.from([0x01]);
    const messageType = Buffer.from([0xC0]);
    const dataLength = Buffer.from([0x00, 0x08]);
    const subMessage = Buffer.from([0x23, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

    const messageWithoutCRC = Buffer.concat([header, address, messageId, messageType, dataLength, subMessage]);
    const crcBytes = calculateCRC16(messageWithoutCRC);

    return Buffer.concat([messageWithoutCRC, crcBytes]);
}

module.exports = createACStatusRequest;
