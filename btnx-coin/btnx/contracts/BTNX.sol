// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title BTNX Stablecoin Token
/// @notice This is a simple ERC-20 token with mint and burn logic restricted to the controller
contract BTNX is ERC20, Ownable {
    address public controller;

    constructor() ERC20("Bhutan eXpress", "BTNX") Ownable(msg.sender) {}

    modifier onlyController() {
        require(msg.sender == controller, "Not authorized");
        _;
    }

    /// @notice Set the address allowed to mint and burn tokens (e.g., backend or peg controller)
    function setController(address _controller) external onlyOwner {
        controller = _controller;
    }

    /// @notice Mint new BTNX tokens to a user (only controller can call this)
    function mint(address to, uint256 amount) external onlyController {
        _mint(to, amount);
    }

    /// @notice Burn BTNX tokens from a user's wallet (only controller can call this)
    function burn(address from, uint256 amount) external onlyController {
        _burn(from, amount);
    }
}

