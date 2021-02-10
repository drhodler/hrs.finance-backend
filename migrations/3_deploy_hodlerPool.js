const HrsToken = artifacts.require("HrsToken");
const HodlerPool = artifacts.require("HodlerPool");

module.exports = async function(deployer, network, accounts) {
  let devFundAccount;
  if (network.startsWith("kovan") || network.startsWith("live") || network.startsWith("mainnet")) {
    //kovan dev account (not dev fund!!)
    //await hrsToken.transfer(0x0050FAE6fdaC085652effe7275A3FBf691ad8E7C, "1000000000000000000");
    devFundAccount = "0xd4350eEcd2D5B7574cAF708A7e98ac4cB51304d3";
  }
  else if (network.startsWith("development")) {
    //await hrsToken.transfer(accounts[0], "1000000000000000000");
    devFundAccount = "0x970c3708b61259Be49a921C9870b11B3cDACD6c1";
  }  
  // Deploy HodlerPool
  const hrsToken = await HrsToken.deployed();
  await deployer.deploy(HodlerPool, hrsToken.address, devFundAccount);
  const hodlerPool = await HodlerPool.deployed();
  //await hrsToken.transfer(hodlerPool.address, "1000000000000000000");  

  await hrsToken.setHodlerPool(hodlerPool.address);
  //await hrsToken.transfer(accounts[0], "1000000000000000000");  
};
