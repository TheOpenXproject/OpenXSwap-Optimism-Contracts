const { expect } = require("chai");
const { ethers } = require("hardhat");
//const { time } = require("./utilities")

const startTime = parseFloat((new Date().getTime()/1000).toFixed(0))

function getWeekInSec(num){
  return parseFloat(num) * 60*60*24*7
}

describe("Check multipliers", function () {
	before(async function () {
		this.signers = await ethers.getSigners()
    this.alice = this.signers[0]

    const SUSHI = await ethers.getContractFactory("test0netERC20");
    this.SUSHI = await SUSHI.deploy("SUSHI", "SUSHI", "18");
    await this.SUSHI.deployed();

    console.log("")//    constructor(IERC20 _openx, uint256 _BONUS_START_TIME, uint256 _BONUS_REDUCE_MARGIN) public {

    const MasterChefV2 = await ethers.getContractFactory("MasterChefV2O");
    this.MasterChefV2 = await MasterChefV2.deploy(this.SUSHI.address, startTime, getWeekInSec(1), [0,12,11,10,9,8,7,6,5,4,3,2,1], getWeekInSec(1) * 13);
    await this.MasterChefV2.deployed();







	});
  it("multiplier now should return 0", async function () {
    const multiplier = await this.MasterChefV2.getPoolMultiplier(startTime);
    expect(multiplier.toNumber()).to.be.equal(0);
  });
  it("multiplier now + 1 week - 500 seconds should return 0", async function () {
    const multiplier = await this.MasterChefV2.getPoolMultiplier(startTime+ getWeekInSec(1)-500);
    expect(multiplier.toNumber()).to.be.equal(0);
  });
  it("week 1 multiplier should return 12", async function () {
    const multiplier = await this.MasterChefV2.getPoolMultiplier(startTime+ getWeekInSec(1));
    expect(multiplier.toNumber()).to.be.equal(12);
  });
  it("week 2 multiplier should return 11", async function () {
    const multiplier = await this.MasterChefV2.getPoolMultiplier(startTime+ getWeekInSec(2));
    expect(multiplier.toNumber()).to.be.equal(11);
  });
  it("week 3 multiplier should return 10", async function () {
    const multiplier = await this.MasterChefV2.getPoolMultiplier(startTime+ getWeekInSec(3));
    expect(multiplier.toNumber()).to.be.equal(10);
  });
  it("week 4 multiplier should return 9", async function () {
    const multiplier = await this.MasterChefV2.getPoolMultiplier(startTime+ getWeekInSec(4));
    expect(multiplier.toNumber()).to.be.equal(9);
  });
  it("week 5 multiplier should return 8", async function () {
    const multiplier = await this.MasterChefV2.getPoolMultiplier(startTime+ getWeekInSec(5));
    expect(multiplier.toNumber()).to.be.equal(8);
  });
  it("week 6 multiplier should return 7", async function () {
    const multiplier = await this.MasterChefV2.getPoolMultiplier(startTime+ getWeekInSec(6));
    expect(multiplier.toNumber()).to.be.equal(7);
  });
  it("week 7 multiplier should return 6", async function () {
    const multiplier = await this.MasterChefV2.getPoolMultiplier(startTime+ getWeekInSec(7));
    expect(multiplier.toNumber()).to.be.equal(6);
  });
  it("week 8 multiplier should return 5", async function () {
    const multiplier = await this.MasterChefV2.getPoolMultiplier(startTime+ getWeekInSec(8));
    expect(multiplier.toNumber()).to.be.equal(5);
  });
  it("week 9 multiplier should return 4", async function () {
    const multiplier = await this.MasterChefV2.getPoolMultiplier(startTime+ getWeekInSec(9));
    expect(multiplier.toNumber()).to.be.equal(4);
  });
  it("week 10 multiplier should return 3", async function () {
    const multiplier = await this.MasterChefV2.getPoolMultiplier(startTime+ getWeekInSec(10));
    expect(multiplier.toNumber()).to.be.equal(3);
  });
  it("week 11 multiplier should return 2", async function () {
    const multiplier = await this.MasterChefV2.getPoolMultiplier(startTime+ getWeekInSec(11));
    expect(multiplier.toNumber()).to.be.equal(2);
  });
  it("week 12 multiplier should return 1", async function () {
    const multiplier = await this.MasterChefV2.getPoolMultiplier(startTime+ getWeekInSec(12));
    expect(multiplier.toNumber()).to.be.equal(1);
  });
  it("week 1000 multiplier should return 1", async function () {
    const multiplier = await this.MasterChefV2.getPoolMultiplier(startTime+ getWeekInSec(10000));
    expect(multiplier.toNumber()).to.be.equal(1);
  });


});

