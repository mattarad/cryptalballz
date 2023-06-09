require('babel-register');
require('babel-polyfill');
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const privateKeys = process.env.PRIVATE_KEYS || ""
// const privKey = Buffer.from(privateKeys, 'hex');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    goerli: {
      provider: () => {
        return new HDWalletProvider(
          privateKeys,
          `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
        )
      },
      gas: 30000000,
      gasPrice: 98000000000,
      network_id: 5
    },
    // main: {
    //   provider: function() {
    //     return new HDWalletProvider(
    //       privateKeys.split(','), // Array of account private keys
    //       `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`// Url to an Ethereum Node
    //     )
    //   },
    //   gas: 5000000,
    //   gasPrice: 5000000000, // 5 gwei
    //   network_id: 1
    // },
    // rinkeby: {
    //   provider: function() {
    //     return new HDWalletProvider(
    //       privateKeys.split(','), // Array of account private keys
    //       `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`// Url to an Ethereum Node
    //     )
    //   },
    //   gas: 5000000,
    //   gasPrice: 5000000000, // 5 gwei
    //   network_id: 4
    // },
    // ropsten: {
    //   provider: function() {
    //     return new HDWalletProvider(
    //       privateKeys.split(','), // Array of account private keys
    //       `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`// Url to an Ethereum Node
    //     )
    //   },
    //   gas: 5000000,
    //   gasPrice: 5000000000, // 5 gwei
    //   network_id: 3
    // }




    
  },
  contracts_directory: './src/backEnd/contracts/',
  contracts_build_directory: './src/backEnd/abis/',
  migrations_directory: './src/backEnd/migrations/',
  test_directory: './test/',
  compilers: {
    solc: {
      version: "0.8.7",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}