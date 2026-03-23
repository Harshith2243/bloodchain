const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const web3 = new Web3('http://localhost:8545');

async function deploy() {
    try {
        const accounts = await web3.eth.getAccounts();
        const mainAccount = "0x1ac013d849c86f23f2e95eb4e68cbc20bf97dc93";
        
        console.log('Deploying from:', mainAccount);

        const requestJsonPath = path.join(__dirname, 'build/contracts/Request.json');
        const requestJson = JSON.parse(fs.readFileSync(requestJsonPath, 'utf8'));

        const RequestContract = new web3.eth.Contract(requestJson.abi);

        console.log('Sending deployment transaction...');
        const instance = await RequestContract.deploy({
            data: requestJson.bytecode
        }).send({
            from: mainAccount,
            gas: 5000000
        });

        const newAddress = instance.options.address;
        console.log('Contract deployed at:', newAddress);

        // Update Request.json
        requestJson.networks['4002'] = {
            events: {},
            links: {},
            address: newAddress,
            transactionHash: instance.transactionHash
        };
        fs.writeFileSync(requestJsonPath, JSON.stringify(requestJson, null, 2));
        console.log('Updated Request.json with new address.');

    } catch (err) {
        console.error('Deployment failed:', err.message);
    }
}

deploy();
