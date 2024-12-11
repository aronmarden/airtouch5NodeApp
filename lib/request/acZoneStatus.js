function createZoneStatusRequest() {
    const header = Buffer.from([0x55, 0x55, 0x55, 0xAA]);
    const address = Buffer.from([0x80, 0xB0]);
    const messageId = Buffer.from([0x01]); 
    const messageType = Buffer.from([0xC0]);
    const dataLength = Buffer.from([0x00, 0x08]);
    const subMessage = Buffer.from([0x21, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

    // Concatenate all parts except CRC
    const messageWithoutCRC = Buffer.concat([header, address, messageId, messageType, dataLength, subMessage]);

    // Calculate CRC16 MODBUS Check Bytes
    const crcBytes = calculateCRC16(messageWithoutCRC);

    // Append CRC16 bytes to the message
    return Buffer.concat([messageWithoutCRC, crcBytes]);
}

function calculateCRC16(buffer) {
    // CRC16 MODBUS calculation
    let crc = 0xFFFF;
    for (let i = 0; i < buffer.length; i++) {
        crc ^= buffer[i];
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x0001) !== 0) {
                crc >>= 1;
                crc ^= 0xA001;
            } else {
                crc >>= 1;
            }
        }
    }
    // Swap bytes
    return Buffer.from([(crc & 0xff), (crc >> 8)]);
}

module.exports = createZoneStatusRequest;