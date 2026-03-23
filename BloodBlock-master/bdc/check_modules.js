const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

async function checkModules() {
    try {
        const result = await new Promise((resolve, reject) => {
            web3.currentProvider.send({
                jsonrpc: "2.0",
                method: "rpc_modules",
                params: [],
                id: 1
            }, (err, response) => {
                if (err) reject(err);
                else resolve(response);
            });
        });
        console.log('RPC Modules:', result);
    } catch (err) {
        console.error('Failed to check modules:', err.message);
    }
}

checkModules();
