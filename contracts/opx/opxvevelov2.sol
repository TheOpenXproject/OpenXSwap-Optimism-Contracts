// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Snapshot.sol";

// opxXXX is pretty simple: deposit your XXX tokens in exchange for opxXXX which represents a proof of deposit.
// This is a one way bond. and the token cant be converted back unless sold on the open market.


contract opxV2 is ERC20, ERC20Snapshot{

    //bonded token address
    IERC20 public bondedToken;
    //Admin recieves token and can take snapshots
    address public admin;
    //if deposits are active
    bool public active;

    IERC20 public v1Token;

    address dead = 0x000000000000000000000000000000000000dEaD;

    // Define the token contract
    constructor(IERC20 _v1, IERC20 _bonded, string memory _name, string memory _symbol, uint8 _decimals) public ERC20(_name, _symbol) {
        v1Token = _v1;
        bondedToken = _bonded;
       	admin = msg.sender;
        active = true;
        _setupDecimals(_decimals);
    }

    uint private unlocked = 1;
    //reentrancy guard for deposit
    modifier lock() {
        require(unlocked == 1, 'LOCKED');
        unlocked = 0;
        _;
        unlocked = 1;
    }

    //change bonded Token receiver, and snapchot admin
    function changeAdmin(address _admin) public {
    	require(msg.sender == admin, "Unauthorized");
    	admin = _admin;
    }

    // Disable deposits
    function disableDeposit() public {
        require(msg.sender == admin, "Unauthorized");
        active = !active;
    }

    // taketh snapshot for reward distribution
    function snapshot() public {
    	require(msg.sender == admin, "Unauthorized");
        _snapshot();
    }
    //deposit token for opxToken
    function deposit(uint256 _amount, address _to) public lock{        
        // send bondedToken to Multisig
        require(active, "Deposits closed");
        bool success = bondedToken.transferFrom(msg.sender, admin, _amount);
        require(success, "TransferFrom Failed.");
        _mint(_to, _amount);
    }

    //takes user's v1 tokens and sends to burn address, mints v2 
    function convert(uint256 _amount, address _to) public lock{
		bool success = v1Token.transferFrom(msg.sender, dead, _amount);
		require(success, "TransferFrom Failed.");
        _mint(_to, _amount);

	}

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Snapshot)
    {
        super._beforeTokenTransfer(from, to, amount);
    }

}