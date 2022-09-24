//SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
contract ContractDeployer {

  address owner;
  address public contractAddr;
  constructor() public{
    owner = msg.sender;
  }


  function deployCtrct(bytes32 salt ,bytes memory bytecode) public returns(address addr){
    require(msg.sender == owner, 'ownable');
     assembly {
      addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
    }
    require(addr != address(0), "Create2: Failed on deploy");

    contractAddr = addr;
  }
}