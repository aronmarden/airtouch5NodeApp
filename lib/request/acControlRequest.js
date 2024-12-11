function createACControlRequest(acNumber, powerSetting, acMode, acFanSpeed, setPointControl) {
    const header = Buffer.from([0x55, 0x55, 0x55, 0xAA]);
    const address = Buffer.from([0x80, 0xB0]);
    const messageId = Buffer.from([0x01]);
    const messageType = Buffer.from([0xC0]);
    const dataLength = Buffer.from([0x00, 0x0C]);
    const subMessage = Buffer.from([0x22, 0x00, 0x00, 0x00, 0x00, 0x04, 0x00, 0x01]);
    const acControlData = Buffer.from([powerSetting << 4 | acMode, acNumber, acFanSpeed, setPointControl]);

    const messageWithoutCRC = Buffer.concat([header, address, messageId, messageType, dataLength, subMessage, acControlData]);
    const crcBytes = calculateCRC16(messageWithoutCRC);

    return Buffer.concat([messageWithoutCRC, crcBytes]);
}

module.exports = createACControlRequest;
