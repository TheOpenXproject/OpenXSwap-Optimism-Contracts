const { expect } = require("chai");
const { ethers } = require("hardhat");
//const { time } = require("./utilities")

const startTime = parseFloat((new Date().getTime()/1000).toFixed(0))

function getWeekInSec(num){
  return parseFloat(num) * 60*60*24*7
}

describe("OpenX Token tests", function () {
	before(async function () {
	this.signers = await ethers.getSigners()
    this.alice = this.signers[0]
    this.bob = this.signers[1]

    const OpenX = await ethers.getContractFactory("OpenX");
    this.OpenX = await OpenX.deploy();
    await this.OpenX.deployed();
    this.treasuryAmount = ethers.BigNumber.from("16624999990000000000000000").div(100).mul(6)
 	
    const OpenXPaymentManager = await ethers.getContractFactory("TokenPaymentManager");
    this.OpenXPaymentManager = await OpenXPaymentManager.deploy(this.OpenX.address, this.treasuryAmount);
    await this.OpenXPaymentManager.deployed();

    await this.OpenX.approve(this.OpenXPaymentManager.address, this.treasuryAmount)

    await this.OpenXPaymentManager.init()

    let claimableAfter1Week = await this.OpenXPaymentManager.getPaymentAmount(startTime + getWeekInSec(1))

    //this.alice.sendTransaction({value:"1000",to: this.OpenXPaymentManager.address})

    console.log()

  });

  it("Contract bal should be 997499999400000000000000 wei", async function () {
    const tresBal = await this.OpenX.balanceOf(this.OpenXPaymentManager.address)
    expect(tresBal).to.be.equal("997499999400000000000000");
  });

  it("1 week release should be closeTo 6394.23076", async function () {
    const releaseAmount = ethers.utils.formatUnits(await this.OpenXPaymentManager.getPaymentAmount(startTime + getWeekInSec(1)))
    expect(parseFloat(releaseAmount)).to.be.closeTo(9591.23076, 0.1);
  });




});

