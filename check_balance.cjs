const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:7545');

async function check() {
    try {
        const pk = '0xb6294ca5b64dddec57ea94e46876b6b646aeb4b6dc9b5280f44439b027249563';
        const account = web3.eth.accounts.privateKeyToAccount(pk);
        const balance = await web3.eth.getBalance(account.address);
        console.log('Address:', account.address);
        console.log('Balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');
        
        const blockNumber = await web3.eth.getBlockNumber();
        console.log('Current Block Number:', blockNumber);
        
        const networkId = await web3.eth.net.getId();
        console.log('Network ID:', networkId);
    } catch (e) {
        console.error(e);
    }
}

check();
