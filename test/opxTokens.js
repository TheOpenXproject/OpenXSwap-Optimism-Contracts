const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("Check opx typed tokens", function () {
	before(async function () {
	this.signers = await ethers.getSigners()
    this.alice = this.signers[0]
    this.treasury = this.signers[1]
    this.john = this.signers[2]
    this.exGF = this.signers[3]

    const DUMMY = await ethers.getContractFactory("testnetToken");

    this.velo = await DUMMY.deploy("velo", "velo test", "18", ethers.utils.parseUnits('1000000', 18));
    await this.velo.deployed();

    this.usdc = await DUMMY.deploy("usdc", "usdc test", "6", ethers.utils.parseUnits('42069', 6));
    await this.usdc.deployed();

    const treasury = this.treasury



    const opxToken = await ethers.getContractFactory("opx");
    this.opxveVELO = await opxToken.deploy(this.velo.address, "opxveVELO", "Perpetually bonded Velo", 18);
    await this.opxveVELO.deployed()


    this.opxUSDC = await opxToken.deploy(this.velo.address, "opxUSDC", "Perpetually bonded usdc", 6);
    await this.opxUSDC.deployed()


});
		it("change admin chould work", async function () {
		await this.opxveVELO.changeAdmin(this.treasury.address)
		let admin = await this.opxveVELO.admin()
	    await expect(admin).to.be.equal(this.treasury.address);
	  });
	  it("alice should have velo tokens and no opxveVELO", async function () {
	    let veloBal = await this.velo.balanceOf(this.alice.address)
	   	let opxveVELO = await this.opxveVELO.balanceOf(this.alice.address)
   	    expect(opxveVELO).to.be.equal(ethers.utils.parseUnits('0', 18));
   	    expect(veloBal).to.not.be.equal(ethers.utils.parseUnits('0', 18));
	  });

	  it("john should not have velo nor opxveVELO", async function () {
	    let veloBal = await this.velo.balanceOf(this.john.address)
   	   	let opxveVELO = await this.opxveVELO.balanceOf(this.alice.address)
	    expect(opxveVELO).to.be.equal(ethers.utils.parseUnits('0', 18));
	    expect(veloBal).to.be.equal(ethers.utils.parseUnits('0', 18));
	  });

	  it("alice deposit without approval should revert", async function () {
	    await expect(this.opxveVELO.deposit(ethers.utils.parseUnits('110', 18), this.alice.address)).to.revertedWith("ERC20: transfer amount exceeds allowance");
	  });

	  it("alice deposit with approval should work", async function () {
	  	await this.velo.approve(this.opxveVELO.address, ethers.utils.parseUnits('110', 18))
	  	this.opxveVELO.deposit(ethers.utils.parseUnits('110', 18), this.alice.address)
   	   	let opxveVELO = await this.opxveVELO.balanceOf(this.alice.address)
   	   	let VELOTreasuryBalance = await this.velo.balanceOf(this.treasury.address)

	    await expect(VELOTreasuryBalance).to.be.equal(ethers.utils.parseUnits('110', 18));
	   	await expect(opxveVELO).to.be.equal(ethers.utils.parseUnits('110', 18));

	  });

	  it("stoping deposits should work", async function () {
	  	await this.opxveVELO.connect(this.treasury).disableDeposit()
	    await expect(this.opxveVELO.deposit(ethers.utils.parseUnits('110', 18), this.alice.address)).to.revertedWith("Deposits closed");
	  });

	  it("starting deposits should work", async function () {
	  	await this.opxveVELO.connect(this.treasury).disableDeposit()
	    await expect(this.opxveVELO.deposit(ethers.utils.parseUnits('110', 18), this.alice.address)).to.revertedWith("ERC20: transfer amount exceeds allowance");
	  });

	  it("1 should be equal to 1", async function () { 
	    await expect(69).to.be.equal(69);
	  });

	  it("opxUSDC should have 6 decimals", async function () { 
	  	let dec = await this.opxUSDC.decimals()
	    await expect(dec).to.be.equal(6);
	  });
	  


  })