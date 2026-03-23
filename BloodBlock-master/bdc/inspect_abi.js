const Web3 = require('web3');
const path = require('path');
const DonorRegisterJSON = require(path.join(__dirname, "build/contracts/Request.json"));
const web3 = new Web3('http://localhost:8545');
const contract = new web3.eth.Contract(DonorRegisterJSON.abi, "0x0");

console.log("METHODS FOR setDonor:");
const method = contract.methods.setDonor;
console.log(JSON.stringify(DonorRegisterJSON.abi.find(i => i.name === 'setDonor'), null, 2));

console.log("\nMETHODS FOR setReq:");
console.log(JSON.stringify(DonorRegisterJSON.abi.find(i => i.name === 'setReq'), null, 2));
