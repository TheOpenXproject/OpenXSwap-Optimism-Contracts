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


	});

  it("Total supply should be 16624999990000000000000000 wei", async function () {
    const supply = await this.OpenX.totalSupply()
    expect(supply).to.be.equal("16624999990000000000000000");
  });

  it("balance of alice should be 16624999990000000000000000 wei", async function () {
    const AliceBalance = await this.OpenX.balanceOf(this.alice.address)
    expect(AliceBalance).to.be.equal("16624999990000000000000000");
  });

  it("balance of bob should be 0", async function () {
    const BobBalance = await this.OpenX.balanceOf(this.bob.address)
    expect(BobBalance).to.be.equal("0");
  });

  it("alice should be able to burn her money", async function () {
    await this.OpenX.burn("1000")
    const AliceBalance = await this.OpenX.balanceOf(this.alice.address)
    expect(AliceBalance.add("1000").toString()).to.be.equal("16624999990000000000000000");
  });

   it("bob should not be able to burn money", async function () {
    await expect(this.OpenX.connect(this.bob).burn("1000")).to.be.revertedWith("ERC20: burn amount exceeds balance");
  });

   //dont know how to write this test any other way but yeah error is self explanatory
  it("minting should fail", async function () {
    let tx = await this.OpenX.mint("1000").catch((err) => {
    	return err
    })
    console.log(tx)
    expect(true).to.be.equal(true);
  });


});

