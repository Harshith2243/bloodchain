const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");

async function check() {
  try {
    const blockNumber = await web3.eth.getBlockNumber();
    console.log("Current block number:", blockNumber);
    const isMining = await web3.eth.isMining();
    console.log("Is mining:", isMining);

    const contractAddress = "0x05da8db4Ba7Ce29052a210616FFF882194a177cE";
    const code = await web3.eth.getCode(contractAddress);
    console.log(
      "Contract code at",
      contractAddress,
      ":",
      code === "0x" ? "No code found" : "Code exists",
    );

    const accounts = await web3.eth.getAccounts();
    console.log("Accounts:", accounts);
    if (accounts.length > 0) {
      const balance = await web3.eth.getBalance(accounts[0]);
      console.log(
        "Balance of",
        accounts[0],
        ":",
        web3.utils.fromWei(balance, "ether"),
        "ETH",
      );
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

check();
