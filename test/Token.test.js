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
    it("Test initial balance (10**25)", async() => {
        let balance = await token.balanceOf(owner)
        assert.equal(balance.valueOf(), 10 ** 25)
    })
    
    it("Initial transfer of funds to shop", async() => {
        let amount = 1000000000
        await token.transfer(shop, amount, {from: owner })
        let balance = await token.balanceOf(shop)
        assert.equal(balance, '1000000000', "Test base commision balance")
    })
    
    it("Test buy commissions", async() => {
        let amount = 2000000
        await token.makeBankAddress(bank)
        await token.addShopAddress(shop)
        await token.transfer(nonOwner, amount, {from: shop })
        let bankBalance = await token.balanceOf(bank)
        let balance = await token.balanceOf(nonOwner)
        console.log("nonOwner balance: " + balance)
        assert.equal(bankBalance, '200000', "Test commision balance")
    })

    it("Test sell commissions bank status", async() => {
        let amount = 10000
        await token.transfer(shop, amount, {from: nonOwner })
        let bankBalance = await token.balanceOf(bank)
        let balance = await token.balanceOf(nonOwner)
        console.log("nonOwner balance: " + balance)
        assert.equal(bankBalance, '201000', "Test commision balance")
    })

    it("Test sell too many tokens", async() => {
        let amount = 1000000000000
        truffleAssert.reverts(token.transfer(shop, amount, {from: nonOwner }), "Not enough funds")
    })

    it("Test sell commissions account status", async() => {
        let balance = await token.balanceOf(nonOwner)
        console.log(balance)
        assert.equal(balance, '1789000', "Test commision balance")
    })

    it("Test buy commissions after change commission", async() => {
        let amount = 1000
        await token.setBuyCommissionPrecentage(2000)
        await token.transfer(nonOwner, amount, {from: shop })
        let bankBalance = await token.balanceOf(bank)
        console.log("bank balance: "+ bankBalance)
        assert.equal(bankBalance, '201200', "Test commision balance")
    })

    it("Test sell commissions after change commission", async() => {
        let amount = 1000
        await token.setSellCommissionPrecentage(3000)
        await token.transfer(shop, amount, {from: nonOwner })
        let bankBalance = await token.balanceOf(bank)
        console.log(bankBalance)
        assert.equal(bankBalance, '201500', "Test commision balance")
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
        assert.equal(bankBalance, '201500', "Test commision balance")
    })
    
    it("Test buy commissions TransferFrom", async() => {
        let amount = 1000
        await token.addShopAddress(shop);
        await token.setBuyCommissionPrecentage(3000)
        let bbb = await token.balanceOf(shop)
        console.log("1 SHOP balance: " + bbb)
        bbb = await token.balanceOf(nonOwner)
        console.log("1 NONOWNER balance: " + bbb)
        bbb = await token.balanceOf(bank)
        console.log("1 BANK balance: " + bbb)
        await token.transferFrom(shop, nonOwner, amount)
        let bankBalance = await token.balanceOf(bank)
        let balance = await token.balanceOf(nonOwner)
        console.log("nonOwner balance: " + balance)
        assert.equal(bankBalance, '201800', "Test commision balance")
    })

    it("Test sell commissions TransferFrom", async() => {
        let amount = 1000
        await token.setSellCommissionPrecentage(2000)
        let bbb = await token.balanceOf(shop)
        console.log("2 SHOP balance: " + bbb)
        bbb = await token.balanceOf(nonOwner)
        console.log("2 NONOWNER balance: " + bbb)
        bbb = await token.balanceOf(bank)
        console.log("2 BANK balance: " + bbb)
        await token.transferFrom(nonOwner, shop, amount)
        let bankBalance = await token.balanceOf(bank)
        let balance = await token.balanceOf(nonOwner)
        console.log("nonOwner balance: " + balance)
        assert.equal(bankBalance, '202000', "Test commision balance")
    })
})