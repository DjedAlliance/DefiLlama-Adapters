const {  nullAddress,treasuryExports } = require("../helper/treasury");

const Treasury_ARB = "0x2902E381c9Caacd17d25a2e008db0a9a4687FDBF";
const Treasury_ETH = "0xdac09f37e132d91b962f30e6ec40d2d08b82b0fa";
const Treasury_OP = "0x489863b61c625a15c74fb4c21486bacb4a3937ab";
const Treasury_POLYGON = "0x4aad282dac74d79e41fd12833b1fad7a18c778ed";
const Treasury_MULTICHAIN = "0x1777c6d588fd931751762836811529c0073d6376";
const THALE_ARB = "0xE85B662Fe97e8562f4099d8A1d5A92D4B453bF30";
const THALES_ETH = "0x8947da500eb47f82df21143d0c01a29862a8c3c5";
const THALES_OP = "0x217d47011b23bb961eb6d93ca9945b7501a5bb11";

module.exports = treasuryExports({
  ethereum: {
    tokens: [
      nullAddress,
      "0x8e870d67f660d95d5be530380d0ec0bd388289e1",
      "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
    ],
    owners: [Treasury_ETH, Treasury_MULTICHAIN],
    ownTokens: [THALES_ETH],  
  },
  optimism: {
    tokens: [
      nullAddress,
      "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
      "0x4200000000000000000000000000000000000042",
      "0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6"
    ],
    owners: [Treasury_OP, Treasury_MULTICHAIN],
    ownTokens: [THALES_OP],  
  },
  arbitrum: {
    tokens: [ 
        nullAddress,
        "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        "0x8971dFb268B961a9270632f28B24F2f637c94244"
     ],
    owners: [Treasury_ARB, Treasury_MULTICHAIN],
    ownTokens: [THALE_ARB],
  },
  polygon: {
    tokens: [
      nullAddress,
      "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
    ],
    owners: [Treasury_POLYGON],
  },
})