const { expect } = require("chai");
const { ethers } = require("hardhat");
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
    this.oldx = await DUMMY.deploy("DUMMY", "DUMMY", "18");
    await this.oldx.deployed();

    this.newx = await DUMMY.deploy("DUMMY", "DUMMY", "18");
    await this.newx.deployed();




    


    await this.oldx.mint(ethers.utils.parseUnits('1000', 18), this.alice.address, { from: this.alice.address })
    await this.newx.mint(ethers.utils.parseUnits('1000', 18), this.alice.address, { from: this.alice.address })

    var oldxOpenX = this.oldx.address
    var newxOpenX = this.newx.address
    var treasury = "0x6B479F4bCf0321c370d266b592Fd44eb0FC47Ca8"

     const xConverter = await ethers.getContractFactory("xConverter");
    this.xConverter = await xConverter.deploy(oldxOpenX, newxOpenX,	treasury);
    await this.xConverter.deployed();
    await this.newx.transfer(this.xConverter.address, ethers.utils.parseUnits('1000', 18));
    await this.oldx.approve(this.xConverter.address, ethers.utils.parseUnits('1000', 18))
    await this.xConverter.convert()

	});

  it("alice newxOpenX bal should be 1000", async function () {
    const multiplier = await this.newx.balanceOf(this.alice.address);
    expect(multiplier).to.be.equal(ethers.utils.parseUnits('1000', 18));
  });
  it("alice oldxOpenX bal should be 0", async function () {
    const multiplier = await this.oldx.balanceOf(this.alice.address);
    expect(multiplier).to.be.equal(ethers.utils.parseUnits('0', 18));
  });

  })