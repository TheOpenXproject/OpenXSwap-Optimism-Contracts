// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
//const { bytecode } = require('../artifacts/contracts/V6ERC20.sol/AnyswapV6ERC20.json');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  	const startTime = parseFloat((new Date().getTime()/1000).toFixed(0))
const deadline = parseFloat((new Date().getTime()/1000).toFixed(0)) +10000

    const FIVEHUNDRED = ethers.utils.parseUnits('500', 18);
    const THREETHOUSAND = ethers.utils.parseUnits('3000', 18)
    this.ZEROADDR = "0x0000000000000000000000000000000000000000";
    this.signers = await ethers.getSigners()
    this.alice = this.signers[0]
    this.hacker = this.signers[1]
    this.carol = this.signers[2]
    this.dev = this.signers[3]
    this.minter = this.signers[4]
    this.LPadder = this.signers[4]

    this.amounts = {
      0: ethers.utils.parseUnits("10000",18),
      1: ethers.utils.parseUnits("100000",18),
      2: ethers.utils.parseUnits("10000",18),
      3: ethers.utils.parseUnits("100000",18),
      4: ethers.utils.parseUnits("100000",18),
      5: ethers.utils.parseUnits("100000",18),
      6: ethers.utils.parseUnits("100000",18),
      7: ethers.utils.parseUnits("10000",18),
      8: ethers.utils.parseUnits("1600",18)
    }


	console.log("deploying: Multicall")
    const Multicall = await ethers.getContractFactory("Multicall2");
    this.multicall = await Multicall.deploy();
    await this.multicall.deployed();

    console.log("deploying: UniswapV2Factory")
    const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
    this.UniswapV2Factory = await UniswapV2Factory.deploy(this.alice.address);
    await this.UniswapV2Factory.deployed();

    console.log("deploying: UniswapV2Router02")
    const UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02");
    this.UniswapV2Router02 = await UniswapV2Router02.deploy(this.UniswapV2Factory.address, "0x4200000000000000000000000000000000000006");
    await this.UniswapV2Router02.deployed();
    

    console.log("deploying: OpenX Token")
    const OpenX = await ethers.getContractFactory("OpenX");
    this.OpenX = await OpenX.deploy();
    await this.OpenX.deployed();

  	console.log("deploying: Dummy Token")
    const Dummy = await ethers.getContractFactory("xPool");
    this.Dummy = await Dummy.deploy("Dummy Token", "Dummy", 18);
    await this.Dummy.deployed();

  	


  	this.farmAmount = ethers.BigNumber.from("16624999990000000000000000").mul(40).div(100)
    
    console.log("deploying: Masterchef")

    const MasterChefV2 = await ethers.getContractFactory("MasterChefV2O");
    this.MasterChefV2 = await MasterChefV2.deploy(this.OpenX.address, startTime, 60*60*24*7, [12,11,10,9,8,7,6,5,4,3,2,1,1], 60*60*24*7 * 13);
    await this.MasterChefV2.deployed();

    await this.MasterChefV2.add(250, this.Dummy.address, this.ZEROADDR)

    await this.OpenX.transfer(this.MasterChefV2.address, this.farmAmount)
 

  	const OpenXBar = await ethers.getContractFactory("OpenXGov");
    this.OpenXBar = await OpenXBar.deploy(this.OpenX.address, this.Dummy.address);
    await this.OpenXBar.deployed();

    console.log("deploying: OpenXMaker")
    const OpenXMaker = await ethers.getContractFactory("OpenXMaker");
    this.OpenXMaker = await OpenXMaker.deploy(this.UniswapV2Factory.address, this.OpenX.address, "0x4200000000000000000000000000000000000006", this.OpenXBar.address);
    await this.OpenXMaker.deployed();

    
    await this.UniswapV2Factory.setFeeTo(this.OpenXMaker.address)
 
   await this.OpenX.approve(this.OpenXBar.address, ethers.utils.parseUnits("285889"))
   await this.Dummy.approve(this.OpenXBar.address, ethers.utils.parseUnits("1"))
   await this.OpenXBar.init(this.MasterChefV2.address)



    this.initialLiquidityOX = ethers.BigNumber.from("16624999990000000000000000").mul(36).div(100)
    this.initialLiquidityOP = ethers.utils.parseUnits('29000', 18)

    this.initialLiquidityETH = ethers.utils.parseUnits('1', 18)
    this.initialLiquidityXETH = ethers.utils.parseUnits('290000', 18)



	console.log("deploying: Dummy Optimism Token")
    const DummyOP = await ethers.getContractFactory("DummyOP");
    this.DummyOP = await DummyOP.deploy("Dummy Optimism Token", "OPDummy", 18);
    await this.DummyOP.deployed();
    
    const DummyETH = await ethers.getContractFactory("DummyOP");
    this.DummyETH = await DummyETH.deploy("Dummy ETH Token", "ETH", 18);
    await this.DummyETH.deployed();


    await this.DummyOP.approve(this.UniswapV2Router02.address, this.initialLiquidityOP)
    await this.OpenX.approve(this.UniswapV2Router02.address, this.initialLiquidityOX)


    await this.UniswapV2Router02.addLiquidity(
    										this.OpenX.address,
    										this.DummyOP.address, 
    										this.initialLiquidityOX, 
    										this.initialLiquidityOP,
    										"0",
    										"0",
    										this.alice.address, 
    										deadline,
    										{ from: this.alice.address })

    await this.DummyETH.approve(this.UniswapV2Router02.address, this.initialLiquidityETH)
    await this.OpenX.approve(this.UniswapV2Router02.address, this.initialLiquidityXETH)


    await this.UniswapV2Router02.addLiquidity(
    										this.DummyETH.address,
    										this.OpenX.address, 
    										this.initialLiquidityETH, 
    										this.initialLiquidityXETH,
    										"0",
    										"0",
    										this.alice.address, 
    										deadline,
    										{ from: this.alice.address })

    const lpAddr = await this.UniswapV2Factory.getPair(this.OpenX.address, this.DummyOP.address);

	const lpAddr2 = await this.UniswapV2Factory.getPair(this.OpenX.address, this.DummyETH.address);
	


	await this.MasterChefV2.add(750, lpAddr, this.ZEROADDR)
	await this.MasterChefV2.add(500, lpAddr2, this.ZEROADDR)
	
	console.log(" ");
	console.log(" ");
	console.log("Multicall deployed to:    ", this.multicall.address);

	console.log("Factory deployed to:      ", this.UniswapV2Factory.address);
	console.log("Router02 deployed to:     ", this.UniswapV2Router02.address);


  	console.log("MasterChefV2 deployed to: ", this.MasterChefV2.address);
   	console.log("OpenXBar deployed to:     ", this.OpenXBar.address);
  	console.log("OpenXMaker deployed to:   ", this.OpenXMaker.address);

    console.log("dummyOP at:                " + this.DummyOP.address)
    console.log("dummyETH at:               " + this.DummyETH.address)
  	console.log("Openx deployed to:        ", this.OpenX.address);

	console.log("OP/OX Pair created at :    " + lpAddr)
	console.log("ETH/OX Pair created at :   " + lpAddr2)


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
