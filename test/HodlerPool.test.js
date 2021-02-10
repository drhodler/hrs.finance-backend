const { assert } = require("chai");

const HrsToken = artifacts.require("HrsToken");
const HodlerPool = artifacts.require("HodlerPool");
const stakerLevelNULL = 999999;
//const { LinkToken } = require("@chainlink/contracts/truffle/v0.4/LinkToken");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function etherToWei(n) {
  return web3.utils.toWei(n, "ether");
}

function weiToEther(n) {
  return web3.utils.fromWei(n, "ether");
}

async function checkInvestorBalances(investor, hrsToken, hodlerPool, expectedWalletBalance, expectedStakingBalance = "0", expectedRewardsBalance = "0") {
  // act
  let walletBalanceOfInvestor = await hrsToken.balanceOf(investor);
  let stakingBalanceOfInvestor = await hodlerPool.stakingBalanceOf(investor);
  let rewardsBalanceOfInvestor = await hodlerPool.rewardsBalanceOf(investor);
  // assert
  assert.equal(
    walletBalanceOfInvestor.toString(),
    etherToWei(expectedWalletBalance),
    "investor's balance should be " + etherToWei(expectedWalletBalance) + " but is " + walletBalanceOfInvestor.toString()
  );
  assert.equal(
    stakingBalanceOfInvestor.toString(),
    etherToWei(expectedStakingBalance),
    "investor's staking balance should be " + etherToWei(expectedStakingBalance) + " but is " + stakingBalanceOfInvestor.toString()
  );
  assert.equal(
    rewardsBalanceOfInvestor.toString(),
    etherToWei(expectedRewardsBalance),
    "investor's rewards balance should be " + etherToWei(expectedRewardsBalance) + " but is " + rewardsBalanceOfInvestor.toString()
  );
}

async function stakeTokens(numberOfTokens, investor, hrsToken, hodlerPool) {
  // arrange
  await hrsToken.approve(hodlerPool.address, etherToWei(numberOfTokens), { from: investor});
  // act
  await hodlerPool.stake(etherToWei(numberOfTokens), { from: investor });
  // assert
  let walletBalanceOfInvestor = await hrsToken.balanceOf(investor);
  let stakingBalanceOfInvestor = await hodlerPool.stakingBalanceOf(investor);
  let rewardsBalanceOfInvestor = await hodlerPool.rewardsBalanceOf(investor);
  assert.equal(
    walletBalanceOfInvestor.toString(),
    etherToWei("0"),
    "investor's balance after staking should be 0"
  );
  assert.equal(
    stakingBalanceOfInvestor.toString(),
    etherToWei(numberOfTokens),
    "investor's staking balance after staking should be " + numberOfTokens
  );
  assert.equal(
    rewardsBalanceOfInvestor.toString(),
    etherToWei("0"),
    "investor's rewards balance after staking should be 0"
  );
}

async function unstakeTokens(expectedNewBalance, investor, hrsToken, hodlerPool) {
  // act
  await hodlerPool.exit({ from: investor });
  // assert
  let walletBalanceOfInvestor = await hrsToken.balanceOf(investor);
  let stakingBalanceOfInvestor = await hodlerPool.stakingBalanceOf(investor);
  let rewardsBalanceOfInvestor = await hodlerPool.rewardsBalanceOf(investor);
  //
  // staking            1.0
  // -
  // staked for 1 block
  // rewards per amount 0.5
  // rewards per time   0.02 (4% of 0.5)
  // -
  // total rewards      1.52
  // tax 10%            0.152
  // total to receive   1.368
  //
  assert.equal(
    weiToEther(walletBalanceOfInvestor.toString()),
    expectedNewBalance,
    //etherToWei(expectedNewBalance),
    "investor's balance after exit should be " + expectedNewBalance
  );
  assert.equal(
    stakingBalanceOfInvestor.toString(),
    etherToWei("0"),
    "investor's staking balance after exit should be 0"
  );
  assert.equal(
    rewardsBalanceOfInvestor.toString(),
    etherToWei("0"),
    "investor's rewards balance after exit should be 0"
  );
}

contract("HodlerPool", ([owner, investor1, investor2, investor3, investor4, investor5, investor6, investor7, investor8, investor9, investor10, 
  investor11, investor12, investor13, investor14, investor15, investor16, investor17, investor18, investor19, investor20, investor21, investor22, 
  investor23, investor24, investor25, investor26, investor27, investor28, investor29, investor30, investor31, investor32, investor33, investor34, 
  investor35, investor36, investor37, investor38, investor39, investor40, investor41, investor42, investor43, investor44, investor45, investor46 , 
  investor47, investor48, investor49, investor50, investor51, investor52, investor53, investor54, investor55, investorX]) => {

  let hrsToken, hodlerPool;  
  //let devFundAccount = "0x18c73ef9B16fb05a5C3954D26b8fCB029E70BF2b"; // for development network
  let devFundAccount = "0x970c3708b61259Be49a921C9870b11B3cDACD6c1"; // for development network  
  let devFundAccountBalance = 0;
  //let devFundAccount = "0xd4350eEcd2D5B7574cAF708A7e98ac4cB51304d3"; // for kovan (live) network

  before(async () => {
    
    console.log("owner address: " + owner);
    console.log("investor1 address: " + investor1);
    console.log("investor2 address: " + investor2);
    console.log("investor3 address: " + investor3);    
    console.log("investor10 address: " + investor10);
    console.log("investor20 address: " + investor20);
    console.log("investor30 address: " + investor30);
    console.log("investor40 address: " + investor40);
    console.log("investor50 address: " + investor50);

    // Load Contracts
    hrsToken = await HrsToken.new();
    hodlerPool = await HodlerPool.new(hrsToken.address, devFundAccount);
    hrsToken.setHodlerPool(hodlerPool.address);

    // Transfer HRST tokens
    await hrsToken.transfer(owner, etherToWei("1"));
    await hrsToken.transfer(investor1, etherToWei("1"));
    await hrsToken.transfer(investor2, etherToWei("1"));
    await hrsToken.transfer(investor3, etherToWei("1"));
    await hrsToken.transfer(investor4, etherToWei("1"));
    await hrsToken.transfer(investor5, etherToWei("1"));
    await hrsToken.transfer(investor6, etherToWei("1"));
    await hrsToken.transfer(investor7, etherToWei("1"));
    await hrsToken.transfer(investor8, etherToWei("1"));
    await hrsToken.transfer(investor9, etherToWei("1"));
    await hrsToken.transfer(investor10, etherToWei("1"));
    await hrsToken.transfer(investor11, etherToWei("1"));
    await hrsToken.transfer(investor12, etherToWei("1"));
    await hrsToken.transfer(investor13, etherToWei("1"));
    await hrsToken.transfer(investor14, etherToWei("1"));
    await hrsToken.transfer(investor15, etherToWei("1"));
    await hrsToken.transfer(investor16, etherToWei("1"));
    await hrsToken.transfer(investor17, etherToWei("1"));
    await hrsToken.transfer(investor18, etherToWei("1"));
    await hrsToken.transfer(investor19, etherToWei("1"));
    await hrsToken.transfer(investor20, etherToWei("1"));
    await hrsToken.transfer(investor21, etherToWei("1"));
    await hrsToken.transfer(investor22, etherToWei("1"));
    await hrsToken.transfer(investor23, etherToWei("1"));
    await hrsToken.transfer(investor24, etherToWei("1"));
    await hrsToken.transfer(investor25, etherToWei("1"));
    await hrsToken.transfer(investor26, etherToWei("1"));
    await hrsToken.transfer(investor27, etherToWei("1"));
    await hrsToken.transfer(investor28, etherToWei("1"));
    await hrsToken.transfer(investor29, etherToWei("1"));
    await hrsToken.transfer(investor30, etherToWei("1"));
    await hrsToken.transfer(investor31, etherToWei("1"));
    await hrsToken.transfer(investor32, etherToWei("1"));
    await hrsToken.transfer(investor33, etherToWei("1"));
    await hrsToken.transfer(investor34, etherToWei("1"));
    await hrsToken.transfer(investor35, etherToWei("1"));
    await hrsToken.transfer(investor36, etherToWei("1"));
    await hrsToken.transfer(investor37, etherToWei("1"));
    await hrsToken.transfer(investor38, etherToWei("1"));
    await hrsToken.transfer(investor39, etherToWei("1"));
    await hrsToken.transfer(investor40, etherToWei("1"));
    await hrsToken.transfer(investor41, etherToWei("1"));
    await hrsToken.transfer(investor42, etherToWei("1"));
    await hrsToken.transfer(investor43, etherToWei("1"));
    await hrsToken.transfer(investor44, etherToWei("1")); // staker #41 (1st follower)
    await hrsToken.transfer(investor45, etherToWei("1"));
    await hrsToken.transfer(investor46, etherToWei("1"));
    await hrsToken.transfer(investor47, etherToWei("1"));
    await hrsToken.transfer(investor48, etherToWei("1"));
    await hrsToken.transfer(investor49, etherToWei("1"));
    await hrsToken.transfer(investor50, etherToWei("1"));
    await hrsToken.transfer(investor51, etherToWei("1"));
    await hrsToken.transfer(investor52, etherToWei("1"));
    await hrsToken.transfer(investor53, etherToWei("1"));
    await hrsToken.transfer(investor54, etherToWei("1"));
    await hrsToken.transfer(investor55, etherToWei("1"));
    //
    await hrsToken.transfer(investorX, etherToWei("44"));

    
  });

  describe("using correct network", async () => {
    it("dev fund accounts match", async () => {
      let devFund = await hodlerPool.getDevFundAccount();
      console.log("dev fund address: " + devFund);
      assert.equal(devFund, devFundAccount);
    });
  });

  describe("Hodler Rewards System Token deployment", async () => {
    it("has a name", async () => {
      const name = await hrsToken.name();
      assert.equal(name, "Hodler Rewards System Token");
    });

    it("1 token has been minted to owner", async () => {
      let balance = await hrsToken.balanceOf(owner);
      assert.equal(balance.toString(), etherToWei("1"));
    });

    it("1 token has been minted to investor1", async () => {
      let balance = await hrsToken.balanceOf(investor1);
      assert.equal(balance.toString(), etherToWei("1"));
    });

    it("1 token has been minted to investor2", async () => {
      let balance = await hrsToken.balanceOf(investor2);
      assert.equal(balance.toString(), etherToWei("1"));
    });

    it("1 tokens have been minted to investor3", async () => {
      let balance = await hrsToken.balanceOf(investor3);
      assert.equal(balance.toString(), etherToWei("1"));
    });

  });

  describe("HodlerPool deployment", async () => {
    it("has a name", async () => {
      const name = await hodlerPool.name();
      assert.equal(name, "Hodler Pool");
    });
  });

  describe("Simple functions to test", async () => {
    it("tax for a staker at level 4 should be 4%", async () => {
      let taxPercentage = await hodlerPool.getTaxPercentage(4);
      assert.equal(taxPercentage.toString(), "4");
    });

    it("tax for a staker at level 3 should be 8%", async () => {
      let taxPercentage = await hodlerPool.getTaxPercentage(3);
      assert.equal(taxPercentage.toString(), "8");
    });

    it("tax for a staker at level 2 should be 12%", async () => {
      let taxPercentage = await hodlerPool.getTaxPercentage(2);
      assert.equal(taxPercentage.toString(), "12");
    });

    it("tax for a staker at level 1 should be 16%", async () => {
      let taxPercentage = await hodlerPool.getTaxPercentage(1);
      assert.equal(taxPercentage.toString(), "16");
    });

    it("tax for a staker at level 0 should be 20%", async () => {
      let taxPercentage = await hodlerPool.getTaxPercentage(0);
      assert.equal(taxPercentage.toString(), "20");
    });

    it("Check that getRandomNumber returns a number between 1 and 5", async () => {
      let maxNumber = 5;
      // check getRandomNumber 20 times
      for (let index = 0; index < 20; index++) {
        let randomNumber = await hodlerPool.getRandomNumber(maxNumber, owner);
        assert.isTrue(Number(randomNumber) > 0);
        assert.isTrue(Number(randomNumber) <= Number(maxNumber));
        await hodlerPool.skipBlockNumber(); // skip block number
      }
    });
  });

  describe("Staking and Unstaking - 1 Staker", async () => {

    it("Check owner balance before staking", async () => {
      await checkInvestorBalances(owner, hrsToken, hodlerPool, "1", "0", "0");
    });

    it("Check pool balance - before owner stakes..", async () => {
      let balance = await hodlerPool.getTotalStakingBalance();
      assert.equal(balance.toString(), etherToWei("0"));
    });

    it("Check total number of stakers is 0", async () => {
      let totalNumberOfStakers = await hodlerPool.getTotalNumberOfStakers();
      assert.equal(totalNumberOfStakers.toString(), "0");
    });

    it("owner stake 1 token...", async () => {
      await stakeTokens("1", owner, hrsToken, hodlerPool);
    });

    it("check owner is a top staker", async () => {
      let isTopStaker = await hodlerPool.isTopStaker(owner);
      assert.equal(isTopStaker.toString(), "true");
    });

    it("check staker level for owner is 4", async () => {
      let stakerLevel = await hodlerPool.getStakerLevel(owner);
      assert.equal(stakerLevel.toString(), "4");
    });

    it("Check for how long has the owner been staking (in blocks)", async () => {
      let blocksStaking = await hodlerPool.getNumberOfBlocksStaking(owner);
      assert.equal(blocksStaking.toString(), "0");
    });

    it("Check earned amount", async () => {
      let earned = await hodlerPool.earned(owner);
      assert.equal(earned.toString(), "0");
    });

    it("Check total number of stakers is 1", async () => {
      let totalNumberOfStakers = await hodlerPool.getTotalNumberOfStakers();
      assert.equal(totalNumberOfStakers.toString(), "1");
    });

    it("Check owner position is #1 (in the staker list)", async () => {
      let stakerPosition = await hodlerPool.getPosition(owner);
      assert.equal(stakerPosition.toString(), "1");
    });

    it("Check pool balance - after owner staked...", async () => {
      let balance = await hodlerPool.getTotalStakingBalance();
      assert.equal(balance.toString(), etherToWei("1"));
    });

    it("Check for how long has the owner been staking (in blocks)", async () => {
      await hodlerPool.skipBlockNumber(); // skip block number
      let blocksStaking = await hodlerPool.getNumberOfBlocksStaking(owner);
      assert.equal(blocksStaking.toString(), "1");
    });

    it("Check earned amount", async () => {
      let earned = await hodlerPool.earned(owner);
      assert.equal(weiToEther(earned).toString(), "0.000001");
    });

    let amountToGetIfUnstaking = 0;
    it("test function amountToGetIfUnstaking", async () => {
      amountToGetIfUnstaking = await hodlerPool.amountToGetIfUnstaking(owner, stakerLevelNULL);
      assert.equal(weiToEther(amountToGetIfUnstaking).toString(), "0.96000096");
    });

    // so far so good... the next will have to change (changes in tax)
    it("owner unstakes...", async () => {
      //await unstakeTokens("1.56924", owner, hrsToken, hodlerPool);
      await unstakeTokens("0.96000192", owner, hrsToken, hodlerPool);
    });

    it("check owner is NOT a top staker", async () => {
      let isTopStaker = await hodlerPool.isTopStaker(owner);
      assert.equal(isTopStaker.toString(), "false");
    });

    it("Check total number of stakers is 0 (0 top stakers)", async () => {
      let totalNumberOfStakers = await hodlerPool.getTotalNumberOfStakers();
      assert.equal(totalNumberOfStakers.toString(), "0");
    });

    it("Check pool balance - after owner unstaked...", async () => {
      let balance = await hodlerPool.getTotalStakingBalance();
      assert.equal(balance.toString(), etherToWei("0"));
    });

    it("Check dev fund balance - after owner unstaked...", async () => {
      devFundAccountBalance = await hrsToken.balanceOf(devFundAccount);
      assert.isTrue(devFundAccountBalance > 0);
    });
  });

  describe("Staking and Unstaking - 3 Stakers (not enough stakers for followers)", async () => {

    it("Check investor1 balance before staking (it has 1 token)", async () => {
      await checkInvestorBalances(investor1, hrsToken, hodlerPool, "1", "0", "0");
    });
    
    it("Check investor2 balance before staking (it has 1 token)", async () => {
      await checkInvestorBalances(investor2, hrsToken, hodlerPool, "1", "0", "0");
    });

    it("Check investor3 balance before staking (it has 1 token)", async () => {
      await checkInvestorBalances(investor3, hrsToken, hodlerPool, "1", "0", "0");
    });

    it("investor1 stake 1 token...", async () => {
      await stakeTokens("1", investor1, hrsToken, hodlerPool)
    });

    it("investor2 stake 1 token...", async () => {
      await stakeTokens("1", investor2, hrsToken, hodlerPool)
    });

    it("investor3 stake 1 token...", async () => {
      await stakeTokens("1", investor3, hrsToken, hodlerPool)
    });

    it("Check pool balance - after all staked...", async () => {
      let balance = await hodlerPool.getTotalStakingBalance();
      assert.equal(balance.toString(), etherToWei("3"));
    });

    it("investor1 unstakes. check withdrawal amount is correct", async () => {
      // staked for 5 blocks...
      await unstakeTokens("0.9600048", investor1, hrsToken, hodlerPool)
    });

    it("Check dev fund balance - after investor1 unstaked...", async () => {
      let prevDevFundBalance = devFundAccountBalance;
      devFundAccountBalance = await hrsToken.balanceOf(devFundAccount);
      assert.isTrue(devFundAccountBalance > prevDevFundBalance);
    });

    it("Check investor2 balances - rewards balance should have increased for being a top staker because investor1 unstaked his tokens)", async () => {
      await checkInvestorBalances(investor2, hrsToken, hodlerPool, "0.013200066", "1", "0.013200066");
    });

    it("Check investor3 balances - rewards balance should have increased for being a top staker because investor1 unstaked his tokens)", async () => {
      await checkInvestorBalances(investor3, hrsToken, hodlerPool, "0.013200066", "1", "0.013200066");
    });

    it("investor3 unstakes. check withdrawal amount is correct", async () => {
      await unstakeTokens("0.973201986", investor3, hrsToken, hodlerPool) //0.960001920
    });
    
    it("Check investor2 balances - rewards balance should have increased for being a top staker because investor3 unstaked his tokens)", async () => {   
      await checkInvestorBalances(investor2, hrsToken, hodlerPool, "0.033200106", "1", "0.033200106");
    });

    it("Check dev fund balance - after investor3 unstaked...", async () => {
      // let balance = await hrsToken.balanceOf(devFundAccount);
      // assert.equal(balance.toString(), etherToWei("0.050294675"));
      let prevDevFundBalance = devFundAccountBalance;
      devFundAccountBalance = await hrsToken.balanceOf(devFundAccount);
      assert.isTrue(devFundAccountBalance > prevDevFundBalance);
    });

    it("investor2 unstakes. check withdrawal amount is correct", async () => {
      // blocksSinceStartedStaking: 5
      await unstakeTokens("0.993204906", investor2, hrsToken, hodlerPool)
    });

    it("Check dev fund balance - after investor2 unstaked...", async () => {
      // let balance = await hrsToken.balanceOf(devFundAccount);
      // assert.equal(balance.toString(), etherToWei("0.01152029536128"));
      let prevDevFundBalance = devFundAccountBalance;
      //console.log("prevDevFundBalance: " + prevDevFundBalance);
      devFundAccountBalance = await hrsToken.balanceOf(devFundAccount);
      //console.log("devFundAccountBalance: " + devFundAccountBalance);
      expect(Number(devFundAccountBalance)).to.be.above(Number(prevDevFundBalance), 'nooo why fail??');
    });

    it("Check pool balance - after all unstaked...", async () => {
      let balance = await hodlerPool.getTotalStakingBalance();
      assert.equal(balance.toString(), etherToWei("0"));
    });
  });

  describe("Staking and Unstaking - 42 Stakers (40 top stakers and 2 followers)", async () => {
    
    // check there are no followers and no stakers
    it("Check there are no followers", async () => {
      let followersCount = await hodlerPool.getFollowersCount();
      assert.equal(followersCount.toString(), "0");
    });

    it("Check there are no stakers", async () => {
      let first40Addresses = await hodlerPool.getFirst40Addresses();
      assert.equal(first40Addresses.length.toString(), "0");
    });
    
    // * stake 40 investors
    it("40 investors stake 1 token...", async () => {
      //await stakeTokens("1", investor1, hrsToken, hodlerPool)
      //await stakeTokens("1", investor2, hrsToken, hodlerPool)
      //await stakeTokens("1", investor3, hrsToken, hodlerPool)
      await stakeTokens("1", investor4, hrsToken, hodlerPool)
      await stakeTokens("1", investor5, hrsToken, hodlerPool)
      await stakeTokens("1", investor6, hrsToken, hodlerPool)
      await stakeTokens("1", investor7, hrsToken, hodlerPool)
      await stakeTokens("1", investor8, hrsToken, hodlerPool)
      await stakeTokens("1", investor9, hrsToken, hodlerPool)
      await stakeTokens("1", investor10, hrsToken, hodlerPool)
      await stakeTokens("1", investor11, hrsToken, hodlerPool)
      await stakeTokens("1", investor12, hrsToken, hodlerPool)
      await stakeTokens("1", investor13, hrsToken, hodlerPool)
      await stakeTokens("1", investor14, hrsToken, hodlerPool)
      await stakeTokens("1", investor15, hrsToken, hodlerPool)
      await stakeTokens("1", investor16, hrsToken, hodlerPool)
      await stakeTokens("1", investor17, hrsToken, hodlerPool)
      await stakeTokens("1", investor18, hrsToken, hodlerPool)
      await stakeTokens("1", investor19, hrsToken, hodlerPool)
      await stakeTokens("1", investor20, hrsToken, hodlerPool)
      await stakeTokens("1", investor21, hrsToken, hodlerPool)
      await stakeTokens("1", investor22, hrsToken, hodlerPool)
      await stakeTokens("1", investor23, hrsToken, hodlerPool)
      await stakeTokens("1", investor24, hrsToken, hodlerPool)
      await stakeTokens("1", investor25, hrsToken, hodlerPool)
      await stakeTokens("1", investor26, hrsToken, hodlerPool)
      await stakeTokens("1", investor27, hrsToken, hodlerPool)
      await stakeTokens("1", investor28, hrsToken, hodlerPool)
      await stakeTokens("1", investor29, hrsToken, hodlerPool)
      await stakeTokens("1", investor30, hrsToken, hodlerPool)
      await stakeTokens("1", investor31, hrsToken, hodlerPool)
      await stakeTokens("1", investor32, hrsToken, hodlerPool)
      await stakeTokens("1", investor33, hrsToken, hodlerPool)
      await stakeTokens("1", investor34, hrsToken, hodlerPool)
      await stakeTokens("1", investor35, hrsToken, hodlerPool)
      await stakeTokens("1", investor36, hrsToken, hodlerPool)
      await stakeTokens("1", investor37, hrsToken, hodlerPool)
      await stakeTokens("1", investor38, hrsToken, hodlerPool)
      await stakeTokens("1", investor39, hrsToken, hodlerPool)
      await stakeTokens("1", investor40, hrsToken, hodlerPool)
      await stakeTokens("1", investor41, hrsToken, hodlerPool)
      await stakeTokens("1", investor42, hrsToken, hodlerPool)
      await stakeTokens("1", investor43, hrsToken, hodlerPool) // he is staker #40!
    });

    it("check investor35 is a top staker", async () => {
      let isTopStaker = await hodlerPool.isTopStaker(investor35);
      assert.equal(isTopStaker.toString(), "true");
    });

    it("check staker level for investor15 is 3", async () => {
      let stakerLevel = await hodlerPool.getStakerLevel(investor15);
      assert.equal(stakerLevel.toString(), "3");
    });

    it("check staker level for investor25 is 2", async () => {
      let stakerLevel = await hodlerPool.getStakerLevel(investor25);
      assert.equal(stakerLevel.toString(), "2");
    });

    it("check staker level for investor35 is 1", async () => {
      let stakerLevel = await hodlerPool.getStakerLevel(investor35);
      assert.equal(stakerLevel.toString(), "1");
    });

    it("Check investor43 position is #40  (in the staker list)", async () => {
      let stakerPosition = await hodlerPool.getPosition(investor43);
      assert.equal(stakerPosition.toString(), "40");
    });

    // check there are no followers 
    it("Check there are no followers", async () => {
      let followersCount = await hodlerPool.getFollowersCount();
      assert.equal(followersCount.toString(), "0");
    });

    it("Check total number of stakers is 40 (40 top stakers)", async () => {
      let totalNumberOfStakers = await hodlerPool.getTotalNumberOfStakers();
      assert.equal(totalNumberOfStakers.toString(), "40");
    });

    // * stake investor # 41 (current stakers 41)
    it("investor #41 stake 1 token...", async () => {
      await stakeTokens("1", investor44, hrsToken, hodlerPool)
    });

    it("check investor44 is NOT a top staker", async () => {
      let isTopStaker = await hodlerPool.isTopStaker(investor44);
      assert.equal(isTopStaker.toString(), "false");
    });

    it("check staker level for investor44 is 0", async () => {
      let stakerLevel = await hodlerPool.getStakerLevel(investor44);
      assert.equal(stakerLevel.toString(), "0");
    });

    it("Check investor44 position is #404 in the staker list, which we can interpret as unknown (might be a follower but is not a top staker)", async () => {
      let stakerPosition = await hodlerPool.getPosition(investor44);
      assert.equal(stakerPosition.toString(), "404");
    });

    // check there is one follower (and that it is investor44)
    it("Check there is 1 follower", async () => {
      let followersCount = await hodlerPool.getFollowersCount();
      assert.equal(followersCount.toString(), "1");
    });

    it("Check total number of stakers is 41 (40 top stakers + 1 follower)", async () => {
      let totalNumberOfStakers = await hodlerPool.getTotalNumberOfStakers();
      assert.equal(totalNumberOfStakers.toString(), "41");
    });

    // * stake investor # 42 (current stakers 42)
    it("investor #42 stake 1 token...", async () => {
      await stakeTokens("1", investor45, hrsToken, hodlerPool)
    });

    it("Make sure when investorX stakes the current rewards doesn't reduce for investor45", async () => {
      let earnedBefore = await hodlerPool.earned(investor45);
      console.log("earnedBefore: " + earnedBefore);
      await stakeTokens("44", investorX, hrsToken, hodlerPool)
      let earnedAfter = await hodlerPool.earned(investor45);
      console.log("earnedAfter: " + earnedAfter);
      expect(Number(earnedAfter)).to.be.above(Number(earnedBefore), 'earnedAfter should be > earnedBefore');
    });

    it("Make sure when investorX gets more rewards than investor45 (as he is staking 50 times more tokens!)", async () => {
      await hodlerPool.skipBlockNumber(); // skip block number
      await hodlerPool.skipBlockNumber(); // skip block number
      let earnedInvestor45 = await hodlerPool.earned(investor45);
      let earnedInvestorX = await hodlerPool.earned(investorX);      
      console.log("earnedInvestor45: " + earnedInvestor45);
      console.log("earnedInvestorX: " + earnedInvestorX);
      expect(Number(earnedInvestorX)).to.be.above(Number(earnedInvestor45), 'earnedInvestorX should be > earnedInvestor45');
      //await hodlerPool.exit({ from: investorX }); // unstake investorX
    });

    it("Check there are 3 followers", async () => {
      let followersCount = await hodlerPool.getFollowersCount();
      assert.equal(followersCount.toString(), "3");
    });

    // check investor #40's rewards balance = 0
    it("Check investor #40's rewards balance before unstaking (it should be 0!)", async () => {
      //await checkInvestorBalances(investor43, hrsToken, hodlerPool, "0", "1", "1");
      let rewardsBalanceOfInvestor = await hodlerPool.rewardsBalanceOf(investor43);
      assert.equal(
        rewardsBalanceOfInvestor.toString(),
        etherToWei("0"),
        "rewards balance should be 0 because no one has unstaken yet"
      );
    });

    // check investor #41's rewards balance = 0
    it("Check investor #41's rewards balance before unstaking (it should be 0!)", async () => {
      //await checkInvestorBalances(investor44, hrsToken, hodlerPool, "1", "0", "0");
      let rewardsBalanceOfInvestor = await hodlerPool.rewardsBalanceOf(investor44);
      assert.equal(
        rewardsBalanceOfInvestor.toString(),
        etherToWei("0"),
        "rewards balance should be 0 because no one has unstaken yet"
      );
    });

    // check investor #42's rewards balance = 0
    it("Check investor #42's rewards balance before unstaking (it should be 0!)", async () => {
      //await checkInvestorBalances(investor44, hrsToken, hodlerPool, "1", "0", "0");
      let rewardsBalanceOfInvestor = await hodlerPool.rewardsBalanceOf(investor45);
      assert.equal(
        rewardsBalanceOfInvestor.toString(),
        etherToWei("0"),
        "rewards balance should be 0 because no one has unstaken yet"
      );
    });

    // * unstake investor 1 (top)
    it("unstake investor 1 (top)", async () => {
      await hodlerPool.exit({ from: investor4 });
    });

    // check investor 40's rewards balance > 0
    it("Check investor #40's balances - rewards balance should have increased for being a top staker because investor #1 unstaked his tokens)", async () => {        
      let rewardsBalanceOfInvestor = await hodlerPool.rewardsBalanceOf(investor43);
      //console.log("rewardsBalanceOfInvestor: " + rewardsBalanceOfInvestor);
      assert.isAbove(
        parseInt(rewardsBalanceOfInvestor),
        0,
        "rewards balance should have increased for being a top staker because investor #1 unstaked his tokens... " + rewardsBalanceOfInvestor.toString() 
      );
    });

    // check investor 41's rewards balance = 0
    it("Check investor #41's balances - rewards balance should have increased because the investor #41 was the top follower and he jumped into the top stakers list when invetor 1 unstaked (and got the rewards in same tx))", async () => {        
      let rewardsBalanceOfInvestor = await hodlerPool.rewardsBalanceOf(investor44);
      assert.isAbove(
        parseInt(rewardsBalanceOfInvestor),
        0,
        "rewards balance should have increased because when investor #1 unstaked his tokens this investor got into the top stakers list and immediately got the rewards... " + rewardsBalanceOfInvestor.toString() 
      );
    });

    // check investor 42's rewards balance = 0
    it("Check investor #42's balances - rewards balance should NOT have increased because the investor #42 was a follower only, and not even a top follower)", async () => {        
      let rewardsBalanceOfInvestor = await hodlerPool.rewardsBalanceOf(investor45);
      assert.equal(
        parseInt(rewardsBalanceOfInvestor),
        0,
        "rewards balance should NOT have increased because the investor #42 was a follower only, and not even a top follower"
      );
    });

    // check investor 41 is in the top 40 (number 40)
    it("Check investor #41 is in the top 40 (and that it is the #40))", async () => {        
      let first40Addresses = await hodlerPool.getFirst40Addresses();
      assert.equal(
        investor44.toString(),
        first40Addresses[39].toString(),
        "address of investor44 and #40 in first40Addresses list doesn't match"
      );
    });

    // check there is 1 follower (and that it is investor #42)
    it("Check there is 1 follower and that it is investor #42", async () => {
      await hodlerPool.exit({ from: investorX }); // unstake investorX
      let followersCount = await hodlerPool.getFollowersCount();
      assert.equal(followersCount.toString(), "1");
      //
      let isFollower = await hodlerPool.isFollower(investor45);
      assert.isTrue(
        isFollower,
        "investor45 should be a follower, but it seems like it's not!"
      );
    });

    // * unstake investor #42
    it("unstake investor #42 (it's a follower)", async () => {
      await hodlerPool.exit({ from: investor45 });
    });

    // check there are no followers 
    it("Check there are no followers", async () => {
      let followersCount = await hodlerPool.getFollowersCount();
      assert.equal(followersCount.toString(), "0");
    });

    // check there are 40 top stakers
    it("Check there are 40 top stakers", async () => {
      let first40Addresses = await hodlerPool.getFirst40Addresses();
      assert.equal(first40Addresses.length.toString(), "40");
    });
  });


  describe("test sending tokens to random follower (needs checking the logs!!!!)", async () => {
    it("get more at least 10 followers", async () => {
      await stakeTokens("1", investor46, hrsToken, hodlerPool) 
      await stakeTokens("1", investor47, hrsToken, hodlerPool)
      await stakeTokens("1", investor48, hrsToken, hodlerPool)
      await stakeTokens("1", investor49, hrsToken, hodlerPool)
      await stakeTokens("1", investor50, hrsToken, hodlerPool)
      await stakeTokens("1", investor51, hrsToken, hodlerPool)
      await stakeTokens("1", investor52, hrsToken, hodlerPool)
      await stakeTokens("1", investor53, hrsToken, hodlerPool) 
      await stakeTokens("1", investor54, hrsToken, hodlerPool)
      await stakeTokens("1", investor55, hrsToken, hodlerPool)
      // stake for investorX as well (follower #10)
      await hrsToken.approve(hodlerPool.address, etherToWei("1"), { from: investorX});
      await hodlerPool.stake(etherToWei("1"), { from: investorX });
    });

    it("investorX unstakes, this should trigger that a random follower should get 10% of tax as rewards - check the logs!!!", async () => {
      // temp actions
      for (let index = 1; index < 11; index++) {
        await hodlerPool.getFollower(index);
      }

      await hodlerPool.exit({ from: investorX });

      // for (let index = 0; index < 20; index++) {
      //   await hodlerPool.getRandomFollower();
      //   await hodlerPool.skipBlockNumber(); // skip block number
      // }
    });
    
  });

});

