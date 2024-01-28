# AirTouch 5 Node.js Application

This application communicates with an AirTouch 5 device and posts the data to New Relic.

## Files

### zoneStatus0x21.js

This script connects to an AirTouch 5 device over a TCP connection and sends a binary request to get the status of all zones. The status includes information such as power state, control method, open percentage, set point, temperature, spill, low battery, and more.

The script uses the `net` module to create a TCP client and connect to the AirTouch 5 device. It sends a binary request created by the `createZoneStatusRequest` function. When it receives data from the AirTouch 5 device, it parses the data using the `parseZoneStatus` function and logs the parsed data.

### newRelicPost.js

This script is a utility module that provides a function to post data to New Relic. It uses the `node-fetch` module to send a POST request to the New Relic API.

The `postToNewRelic` function takes three parameters: the data to post, the API key, and the account ID. It compresses the data using gzip, then sends a POST request with the compressed data in the body. The `Content-Encoding` and `Content-Type` headers are set to `gzip` and `application/json` respectively.

## Usage

To run the application, you need to set the `HOST`, `PORT`, `API_KEY`, and `ACCOUNT_ID` variables in the `keys.json` file, then run the `zoneStatus0x21.js` script with Node.js:

```bash
node zoneStatus0x21.js