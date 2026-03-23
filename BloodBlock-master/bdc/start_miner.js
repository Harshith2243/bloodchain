const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

async function startMiner() {
    try {
        console.log('Attempting to start miner...');
        // In Geth 1.1x, miner_start is the method. 
        // We use web3.currentProvider.send if web3.eth.miner doesn't exist.
        const result = await new Promise((resolve, reject) => {
            web3.currentProvider.send({
                jsonrpc: "2.0",
                method: "miner_start",
                params: [1],
                id: new Date().getTime()
            }, (err, response) => {
                if (err) reject(err);
                else resolve(response);
            });
        });
        console.log('Miner start result:', result);
    } catch (err) {
        console.error('Failed to start miner:', err.message);
    }
}

startMiner();
