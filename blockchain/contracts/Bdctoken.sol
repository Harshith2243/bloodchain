// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bdctoken {
    string public name = "Blood Donation Coin";
    string public symbol = "BDC";
    uint8 public decimals = 0;
    uint256 public totalSupply = 1_000_000;

    address public owner;

    mapping(address => uint256) private _balances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Mint(address indexed to, uint256 value);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
        _balances[owner] = totalSupply;
        emit Mint(owner, totalSupply);
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) internal {
        require(to != address(0), "Cannot transfer to zero address");
        require(_balances[owner] >= amount, "Insufficient owner balance");
        _balances[owner] -= amount;
        _balances[to] += amount;
        emit Transfer(owner, to, amount);
    }
}