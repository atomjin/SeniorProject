const io = require('socket.io-client');
const fs = require('fs');
const { Parser } = require('json2csv');

// File path to read the token from
const tokenFilePath = 'token.txt';

// Read the token from the file
let socketToken;
try {
    socketToken = fs.readFileSync(tokenFilePath, 'utf8').trim();
    console.log('Socket token loaded successfully.');
} catch (err) {
    console.error('Error reading socket token from file:', err);
    process.exit(1); // Exit the script if token cannot be read
}

// Connect to socket
const streamlabs = io(`https://sockets.streamlabs.com?token=${socketToken}`, { transports: ['websocket'] });

// File path to write the data
const filePath = 'donation_receive.csv';

console.log('Script is running. Press Ctrl + C to exit.');

// Perform Action on event
streamlabs.on('event', (eventData) => {
    if (!eventData.for && eventData.type === 'donation') {
        // Code to handle donation events
        console.log(eventData);

        // Extract name and amount from the donation event
        const donations = eventData.message.map(donation => [donation.from, donation.amount]);

        // Convert donation data to CSV format
        const json2csvParser = new Parser({ header: false, eol: '\n' }); // Set end-of-line character to newline
        const csvData = json2csvParser.parse(donations) + '\n'; // Append newline character after each set of data

        // Write the CSV data to the file
        fs.appendFile(filePath, csvData, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('Data written to file:', donations);
            }
        });

    }
});
