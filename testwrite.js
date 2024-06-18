const io =require('socket.io-client');
const fs =require('fs');
const { Parser } = require('json2csv');

//config
const tokenFilePath = 'token.txt';
const filePath = 'donation_receive.csv';

//read the token from file
function readTokenFromFile(path){
    try{
        const token =fs.readFileSync(path,'utf8').trim();
        console.log('soket token loaded successfully.');
        return token;
    } catch (err){
        console.error('Error reading from socket token from file', err);
        process.exit(1);
    }
}


//Handle donation event
function handleDonation(eventData) {
    if (!eventData.for && eventData.type === 'donation') {
        console.log('Donation event received:', eventData);

        const donations = eventData.message.map(donation => ({
            from: donation.from,
            amount: donation.amount
        }));

        writeToCSV(donations);
    }
}

//write donation data to csv file
function writeToCSV(donations) {
    const json2csvParser = new Parser({ header: false, eol: '\n' });
    const csvData = json2csvParser.parse(donations) + '\n';

    fs.appendFile(filePath, csvData, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Data written to file:', donations);
        }
    });
}

function main(){
    const socketToken = readTokenFromFile(tokenFilePath);
    const streamlabs = io(`https://sockets.streamlabs.com?token=${socketToken}`, { transports: ['websocket'] });

    console.log('Script is running. Press ctrl+c to exit');

    streamlabs.on('event',(eventData)=>{
        handleDonation(eventData);
    });

    streamlabs.on('connect',()=>{
        console.log('connected to streamslabs socket.');
    });

    streamlabs.on('disconnect',()=>{
        console.log('disconnected from streamlabs socket.');
    });

    streamlabs.on('error',(error)=>{
        console.error('socket error:',error);
    });
}

main();
    
