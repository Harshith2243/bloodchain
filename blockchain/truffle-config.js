module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // safer than 4002
      gas: 6000000
    }
  },

  mocha: {},

  compilers: {
    solc: {
      version: "0.8.20", // ✅ FIXED HERE
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        viaIR: true
      }
    }
  }
};