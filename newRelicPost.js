// newrelicpost.js
const fetch = import('node-fetch').then(nodeFetch => nodeFetch.default || nodeFetch);
const { gzip } = require('zlib');
const { promisify } = require('util');
const gzipAsync = promisify(gzip);

async function postToNewRelic(result, apiKey, accountId) {

    try {
        // Create a new object and merge the existing data with the new key-value pairs
        const data = result

        // Gzip the data
        const gzippedData = await gzipAsync(JSON.stringify(data));

        // Prepare the URL and headers
        const url = `https://insights-collector.newrelic.com/v1/accounts/${accountId}/events`;
        const headers = {
            'Content-Type': 'application/json',
            'Api-Key': apiKey,
            'Content-Encoding': 'gzip'
        };

        // Post the gzipped data
        const response = await (await fetch)(url, {
            method: 'POST',
            headers: headers,
            body: gzippedData
        });

        // Check the response
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return {
            response: await response.text(),
            data: data
        };
    } catch (error) {
        console.error('Error posting data to New Relic:', error);
        throw error;
    }
}

module.exports = { postToNewRelic };
