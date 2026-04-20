export const CONTRACT_ADDRESS = "0xDAFEAAaE95bC1f021490910E988a8Ff98f9be34c";
export const EXPECTED_CHAIN_ID = "0x539"; // 1337 in hex (Ganache CLI default)

export const isCorrectNetwork = (hexId) => {
  if (!hexId) return false;
  // Convert any format to numeric for reliable comparison
  return parseInt(hexId, 16) === 1337;
};

export const switchNetwork = async () => {
  if (!window.ethereum) return;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: EXPECTED_CHAIN_ID }],
    });
  } catch (error) {
    // This error code means the chain has not been added to MetaMask
    if (error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: EXPECTED_CHAIN_ID,
            chainName: "Ganache Local",
      rpcUrls: ["http://127.0.0.1:8545"],
            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
            blockExplorerUrls: null,
          },
        ],
      });
    }
  }
};

export const DONOR_REGISTER_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_donorId", "type": "address" },
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "uint8", "name": "_age", "type": "uint8" },
      { "internalType": "string", "name": "_place", "type": "string" },
      { "internalType": "uint256", "name": "_mobile", "type": "uint256" },
      { "internalType": "bool", "name": "_medCondition", "type": "bool" },
      { "internalType": "enum DonorRegister.Gender", "name": "_gender", "type": "uint8" },
      { "internalType": "enum DonorRegister.BloodGroup", "name": "_bloodGroup", "type": "uint8" }
    ],
    "name": "setDonor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const REQUEST_ABI = [
  ...DONOR_REGISTER_ABI,
  {
    "inputs": [
      { "internalType": "string", "name": "_location", "type": "string" },
      { "internalType": "enum DonorRegister.BloodGroup", "name": "_bloodGroup", "type": "uint8" }
    ],
    "name": "createRequest",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
