// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    
    mapping(address => bool) shopAddresses;
    uint buyCommissionPrecentage;
    uint sellCommissionPrecentage;
    address bank;
    constructor(string memory _TokenName, string memory _TokenSymbol, uint256 limitMint) ERC20(_TokenName, _TokenSymbol) 
    {
        _mint(msg.sender, limitMint);
        buyCommissionPrecentage = 1000;
        sellCommissionPrecentage = 1000;
    }

    //Set address where all commission funds go to
    function makeBankAddress(address bankAddress) public 
    onlyOwner
    {
        bank = bankAddress;
    }

    //Self explanatory
    function setBuyCommissionPrecentage(uint precentage) public 
    onlyOwner
    {
        require(precentage < 10000, "Must be less then 100%");
        buyCommissionPrecentage = precentage;
    }
    
    //Self explanatory
    function setSellCommissionPrecentage(uint precentage) public 
    onlyOwner
    {
        require(precentage < 10000, "Must be less then 100%");
        sellCommissionPrecentage = precentage;
    }
    
    //Self explanatory
    function addShopAddress(address shopAddress) public
    onlyOwner
    {
        require(!shopAddresses[shopAddress],"its set to true now");
        shopAddresses[shopAddress] = true;
    }

    //Self explanatory
    function removeShopAddress(address shopAddress) public
    onlyOwner
    {
        require(shopAddresses[shopAddress],"its set to false now");
        shopAddresses[shopAddress] = false;
    }

    //override for the ERC20 transfer function to add commissions
    function transfer(address recipient, uint256 amount) public virtual override(ERC20) returns (bool) {
        
        if (shopAddresses[recipient])
        {
            uint256 senderBalance = balanceOf(_msgSender());
            require(senderBalance >= amount * (10000+sellCommissionPrecentage) / 10000, "Not enough funds for commission or total transfer");
            _transfer(_msgSender(), recipient, amount);
            _transfer(_msgSender(), bank, amount * sellCommissionPrecentage / 10000);
        }
        else if (shopAddresses[_msgSender()]) 
        {
            _transfer(_msgSender(), recipient, amount);
            _transfer(recipient, bank, amount * buyCommissionPrecentage / 10000);
        }
        else
        {
            _transfer(_msgSender(), recipient, amount);
        }
        return true;
    }
}
