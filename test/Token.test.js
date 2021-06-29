const Token = artifacts.require("../contracts/Token.sol");
const truffleAssert = require('truffle-assertions');

contract ("Token", (accounts) =>{
    let owner       = accounts[0];
    let shop        = accounts[1];
    let nonOwner    = accounts[2];
    let bank        = accounts[3];
    before(async () => {
        token = await Token.deployed()
    })
    it("Test initial balance (10**15)", async() => {
        let balance = await token.balanceOf(owner)
        assert.equal(balance.valueOf(), 10 ** 15)
    })
    
    it("Initial transfer of funds to shop", async() => {
        let amount = 1000000
        await token.transfer(shop, amount, {from: owner })
        let balance = await token.balanceOf(shop)
        assert.equal(balance, '1000000', "Test base commision balance")
    })
    
    it("Test buy commissions", async() => {
        let amount = 20000
        await token.makeBankAddress(bank)
        await token.addShopAddress(shop)
        await token.transfer(nonOwner, amount, {from: shop })
        let bankBalance = await token.balanceOf(bank)
        let balance = await token.balanceOf(nonOwner)
        console.log("nonOwner balance: " + balance)
        assert.equal(bankBalance, '2000', "Test commision balance")
    })

    it("Test sell commissions bank status", async() => {
        let amount = 10000
        await token.transfer(shop, amount, {from: nonOwner })
        let bankBalance = await token.balanceOf(bank)
        let balance = await token.balanceOf(nonOwner)
        console.log("nonOwner balance: " + balance)
        assert.equal(bankBalance, '3000', "Test commision balance")
    })

    it("Test sell too many tokens", async() => {
        let amount = 1000000
        truffleAssert.reverts(token.transfer(shop, amount, {from: nonOwner }), "Not enough funds")
    })

    it("Test sell commissions account status", async() => {
        let balance = await token.balanceOf(nonOwner)
        console.log(balance)
        assert.equal(balance, '7000', "Test commision balance")
    })

    it("Test buy commissions after change commission", async() => {
        let amount = 1000
        await token.setBuyCommissionPrecentage(2000)
        await token.transfer(nonOwner, amount, {from: shop })
        let bankBalance = await token.balanceOf(bank)
        console.log("bank balance: "+ bankBalance)
        assert.equal(bankBalance, '3200', "Test commision balance")
    })

    it("Test sell commissions after change commission", async() => {
        let amount = 1000
        await token.setSellCommissionPrecentage(3000)
        await token.transfer(shop, amount, {from: nonOwner })
        let bankBalance = await token.balanceOf(bank)
        console.log(bankBalance)
        assert.equal(bankBalance, '3500', "Test commision balance")
    })

    it("Test buy commissions overcharge", async() => {
        truffleAssert.reverts(token.setBuyCommissionPrecentage(20000), "Must be less then 100%")
    })

    it("Test sell commissions overcharge", async() => {
        truffleAssert.reverts(token.setSellCommissionPrecentage(30000), "Must be less then 100%")
    })

    it("Test remove commision charge", async() => {
        let amount = 1000
        await token.setSellCommissionPrecentage(1000)
        await token.removeShopAddress(shop);
        await token.transfer(shop, amount, {from: nonOwner })
        let bankBalance = await token.balanceOf(bank)
        console.log("Bank balance: " + bankBalance)
        let balance = await token.balanceOf(nonOwner)
        console.log("nonOwner balance= " + balance)
        assert.equal(bankBalance, '3500', "Test commision balance")
    })
    
})