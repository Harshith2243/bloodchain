const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const web3 = new Web3('http://localhost:8545');

async function run() {
    try {
        const accounts = await web3.eth.getAccounts();
        const mainAccount = accounts[0];
        console.log('Main account (from dev node):', mainAccount);

        // 1. Check block number
        let blockNumber = await web3.eth.getBlockNumber();
        console.log('Current block number:', blockNumber);

        // 2. Deploy Request contract
        const requestJsonPath = path.join(__dirname, 'build/contracts/Request.json');
        const requestJson = JSON.parse(fs.readFileSync(requestJsonPath, 'utf8'));
        const RequestContract = new web3.eth.Contract(requestJson.abi);

        console.log('Deploying Request contract...');
        const deployment = RequestContract.deploy({
            data: requestJson.bytecode
        });

        const instance = await deployment.send({
            from: mainAccount,
            gas: 6000000
        });

        const newAddress = instance.options.address;
        console.log('Contract deployed at:', newAddress);

        // Update Request.json
        requestJson.networks['4002'] = {
            address: newAddress,
            transactionHash: instance.transactionHash
        };
        fs.writeFileSync(requestJsonPath, JSON.stringify(requestJson, null, 2));
        console.log('Updated Request.json');

        // Update app.js (to use the new account address)
        const appJsPath = path.join(__dirname, 'app.js');
        let appJsContent = fs.readFileSync(appJsPath, 'utf8');
        appJsContent = appJsContent.replace(/account = "0x[a-fA-F0-9]{40}";/, `account = "${mainAccount}";`);
        fs.writeFileSync(appJsPath, appJsContent);
        console.log('Updated app.js with new account address.');

    } catch (err) {
        console.error('Final failure:', err.message);
    }
}

run();
