const HrsToken = artifacts.require('HrsToken')

module.exports = async function(deployer, network, accounts) {
  // Deploy Dapp Token
  await deployer.deploy(HrsToken)
  const hrsToken = await HrsToken.deployed()
}
