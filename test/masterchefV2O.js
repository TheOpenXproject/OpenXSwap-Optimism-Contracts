const { expect } = require("chai");
const { ethers } = require("hardhat");
//const { time } = require("./utilities")

const startTime = parseFloat((new Date().getTime()/1000).toFixed(0))
function getTimeNow(){
  return parseFloat((new Date().getTime()/1000).toFixed(0));
}
function getWeekInSec(num){
  return parseFloat(num) * 60*60*24*7
}

describe("Check multipliers", function () {
	before(async function () {
		this.signers = await ethers.getSigners()
    this.alice = this.signers[0]
    this.bob = this.signers[1]
    this.john = this.signers[2]
    this.exGF = this.signers[3]

    const OpenX = await ethers.getContractFactory("OpenX");
    this.OpenX = await OpenX.deploy();
    await this.OpenX.deployed();

    const SLP = await ethers.getContractFactory("test0netERC20");
    this.SLP = await SLP.deploy("FAKE LP", "SLP", "18");
    await this.SLP.deployed();


    const DUMMY = await ethers.getContractFactory("test0netERC20");
    this.DUMMY = await DUMMY.deploy("DUMMY", "DUMMY", "18");
    await this.DUMMY.deployed();

    await this.DUMMY.mint(ethers.utils.parseUnits("1"), this.alice.address);

    await this.SLP.mint(ethers.utils.parseUnits('1000', 18), this.alice.address, { from: this.alice.address })
    await this.SLP.mint(ethers.utils.parseUnits('1000', 18), this.bob.address, { from: this.alice.address })
    await this.SLP.mint(ethers.utils.parseUnits('1000', 18), this.john.address, { from: this.alice.address })


    this.farmAmount = ethers.BigNumber.from("16624999990000000000000000").div(100).mul(40)
    console.log("")//    constructor(IERC20 _openx, uint256 _BONUS_START_TIME, uint256 _BONUS_REDUCE_MARGIN) public {



    const MasterChefV2 = await ethers.getContractFactory("MasterChefV2O");
    this.MasterChefV2 = await MasterChefV2.deploy(this.OpenX.address, startTime, 30, [0,12,11,10,9,8,7,6,5,4,3,2,1], 30*13);
    await this.MasterChefV2.deployed();


    this.OpenX.transfer(this.MasterChefV2.address, this.farmAmount)

    await this.MasterChefV2.add(250, this.DUMMY.address, "0x0000000000000000000000000000000000000000")


    await this.MasterChefV2.add(750, this.SLP.address, "0x0000000000000000000000000000000000000000")



	});
  it("first week multiplier should return 0", async function () {
    const multiplier = await this.MasterChefV2.getPoolMultiplier(startTime);
    expect(multiplier).to.be.equal("0");
  });
  it("Mastechef balance of OpenX should be non 0", async function () {
    const masterBal = await this.OpenX.balanceOf(this.MasterChefV2.address)
    expect(masterBal).to.not.be.equal("0");
  });
  it("Mastechef balance of SLP should be 0", async function () {
    const masterBal = await this.SLP.balanceOf(this.MasterChefV2.address)
    expect(masterBal.toNumber()).to.be.equal(0);
  });
  it("alice deposit of 100 SLP should work", async function () {
    await this.SLP.approve(this.MasterChefV2.address, ethers.utils.parseUnits('1000', 18))
    await this.MasterChefV2.deposit(1, ethers.utils.parseUnits('100', 18), this.alice.address)
    let AliceBalance = await this.MasterChefV2.userInfo(1, this.alice.address)
    expect(AliceBalance[0].toString()).to.not.be.equal("0");
  });
  it("alice deposit of 100 SLP should work", async function () {
    await this.SLP.approve(this.MasterChefV2.address, ethers.utils.parseUnits('1000', 18))
    await this.MasterChefV2.deposit(1, ethers.utils.parseUnits('100', 18), this.alice.address)
    let AliceBalance = await this.MasterChefV2.userInfo(1, this.alice.address)
    expect(AliceBalance[0].toString()).to.not.be.equal("0");
  });
  it("BOB's openX deposit balance should be 0", async function () {
    
    let bobBalance = await this.MasterChefV2.userInfo(1, this.bob.address)
    expect(bobBalance[0].toString()).to.be.equal("0");
  });
  it("BOB's SLP deposit balance should be 0", async function () {
    
    let bobBalance = await this.MasterChefV2.userInfo(1, this.bob.address)
    expect(bobBalance[0].toString()).to.be.equal("0");
  });
  it("EX's SLP deposit balance should be 0", async function () {
    let bobBalance = await this.MasterChefV2.userInfo(1, this.exGF.address)
    expect(bobBalance[0].toString()).to.be.equal("0");
  });
  it("EX's OPENX balance should be 0 since its fake internet money and she didnt believe", async function () {
    let BitchBal = await this.OpenX.balanceOf(this.exGF.address)
    expect(BitchBal.toString()).to.be.equal("0");
  });
  it("Bob deposit of 300 SLP should work", async function () {
    await this.SLP.approve(this.MasterChefV2.address, ethers.utils.parseUnits('1000', 18))
    await this.MasterChefV2.deposit(1, ethers.utils.parseUnits('300', 18), this.bob.address)
    let BobBalance = await this.MasterChefV2.userInfo(1, this.bob.address)
    expect(BobBalance[0].toString()).to.not.be.equal("0");
  });
  it("Bob deposit of 400 SLP should work", async function () {
    await this.SLP.approve(this.MasterChefV2.address, ethers.utils.parseUnits('1000', 18))
    await this.MasterChefV2.deposit(1, ethers.utils.parseUnits('400', 18), this.bob.address)
    let BobBalance = await this.MasterChefV2.userInfo(1, this.bob.address)
    expect(BobBalance[0].toString()).to.not.be.equal("0");
  });

  it("Bob pending for SLP solo should be 0", async function (){
    await this.MasterChefV2.pendingReward(1, this.bob.address)
    let BobPending = await this.MasterChefV2.pendingReward(1, this.bob.address)
    expect(BobPending.toString()).to.be.equal("0");
  });
  it("Bob pending for SLP pool should be 0", async function (){
    let BobPending = await this.MasterChefV2.pendingReward(1, this.bob.address)
    expect(BobPending.toString()).to.be.equal("0");
  });
  it("Alice pending for SLP solo should be 0", async function (){
    await this.MasterChefV2.pendingReward(1, this.alice.address)
    let BobPending = await this.MasterChefV2.pendingReward(1, this.alice.address)
    expect(BobPending.toString()).to.be.equal("0");
  });
  it("Alice pending for SLP pool should be 0", async function (){
    let BobPending = await this.MasterChefV2.pendingReward(1, this.alice.address)
    expect(BobPending.toString()).to.be.equal("0");
  });
  it("Alice claiming for SLP pool should be 0", async function (){
    let BobPending = await this.MasterChefV2.pendingReward(1, this.alice.address)
    expect(BobPending.toString()).to.be.equal("0");
  });

  it("Waiting until starting period", async function (){
    console.log("waiting 30s")
    await new Promise(r => setTimeout(r, 30000));
    //await this.MasterChefV2.massUpdatePools([0,1])
    //console.log(await this.MasterChefV2.getPoolMultiplier(getTimeNow()))
    expect("didWait").to.be.equal("didWait");
  });

  it("Bob pending for SLP solo should not be 0", async function (){
    await this.MasterChefV2.pendingReward(1, this.bob.address)
    let BobPending = await this.MasterChefV2.pendingReward(1, this.bob.address)
    expect(BobPending.toString()).to.not.be.equal("0");
  });

  it("Bob pending for SLP pool should be not 0", async function (){
    let BobPending = await this.MasterChefV2.pendingReward(1, this.bob.address)
    expect(BobPending.toString()).to.not.be.equal("0");
  });

  it("Alice pending for SLP solo should be not 0", async function (){
    await this.MasterChefV2.pendingReward(1, this.alice.address)
    let BobPending = await this.MasterChefV2.pendingReward(1, this.alice.address)
    expect(BobPending.toString()).to.not.be.equal("0");
  });

  it("Alice pending for SLP pool should be not 0", async function (){
    let BobPending = await this.MasterChefV2.pendingReward(1, this.alice.address)
    expect(BobPending.toString()).to.not.be.equal("0");
  });

  it("Adding same pool twice should fail", async function (){
    await expect(this.MasterChefV2.add(750, this.SLP.address, "0x0000000000000000000000000000000000000000")).to.be.revertedWith("Must be unique.");
  });
  
  it("Adding OpenX pool should fail", async function (){
    await expect(this.MasterChefV2.add(750, this.OpenX.address, "0x0000000000000000000000000000000000000000")).to.be.revertedWith("Can't add OpenX");
  });





});
