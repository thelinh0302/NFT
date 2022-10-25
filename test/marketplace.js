const { expect } = require("chai")
const { ethers } = require("hardhat");

describe("marketplace", function () {
    let [admin, seller, buyer, feeRecipient, samplePaymentToken] = []
    let petty
    let gold
    let marketplace
    let defaultFeeRate = 10
    let defaultFeeDecimal = 0
    let defaultPrice = ethers.utils.parseEther("100")
    let defaultBalance = ethers.utils.parseEther("10000")
    let address0 = "0x0000000000000000000000000000000000000000"
    this.beforeEach(async () => {
        [admin, seller, buyer, feeRecipient, samplePaymentToken] = await ethers.getSigners();
        const Petty = await ethers.getContractFactory("Petty")
        petty = await Petty.deploy()
        await petty.deployed()

        const Gold = await ethers.getContractFactory("Gold")
        gold = await Gold.deploy()
        await gold.deployed()
        const Marketplace = await ethers.getContractFactory("Marketplace")
        marketplace = await Marketplace.deploy(petty.address,defaultFeeDecimal,defaultFeeRate,feeRecipient.address)
        await marketplace.deployed()
        await marketplace.addPaymentToken(gold.address)
        await gold.transfer(seller.address, defaultBalance)
        await gold.transfer(buyer.address, defaultBalance)
    })
    describe("common", function () {
        it("FeeDecimal should return correct value", async function () {
            expect(await marketplace.feeDecimal()).to.be.equal(defaultFeeDecimal)
        })
        it("FeeRate should return correct value", async function () {
            expect(await marketplace.feeRate()).to.be.equal(defaultFeeRate)
        })
        it("FeeRecipient should return correct value", async function () {
            expect(await marketplace.feeRecipient()).to.be.equal(feeRecipient.address)
        })
    })
    describe("updateFeeRecipient", function () {
        it("should revert if feeRecipient is address 0", async function () {
            await expect(marketplace.updateFeeRecipient(address0)).to.be.revertedWith("NFTMarketplace: feeRecipient_ is zero address")
        })
        it("should revert if sender isn't contract owner", async function () {
            await expect(marketplace.connect(buyer).updateFeeRecipient(address0)).to.be.revertedWith("Ownable: caller is not the owner")
        })
        it("should update correctly", async function () {
            await expect(marketplace.updateFeeRecipient(buyer.address))
            expect(await marketplace.feeRecipient()).to.be.equal(buyer.address)
        })
    })
    describe("updateFeeRate", function () {
        it("should revert if fee rate >= 10 ^(feeDecimal+2)", async function () {
            await expect(marketplace.updateFeeRate(0,100)).to.be.revertedWith("NFTMarketplace: bad fee rate")
        })
        it("should revert if sender isn't contract owner", async function () {
            await expect(marketplace.connect(buyer).updateFeeRate(0,10)).to.be.rejectedWith("Ownable: caller is not the owner")
        })
        it("should update correctly", async function () {
            const updateFeeRateTx = await marketplace.updateFeeRate(0, 20)
           
            expect(await marketplace.feeDecimal()).to.be.equal(0)
            expect(await marketplace.feeRate()).to.be.equal(20)
            await expect(updateFeeRateTx).to.be.emit(marketplace,"FeeRateUpdated").withArgs(0,20)
        })
    })

    describe("addPaymentToken", function () {
        it("should revert paymentToken is Address 0", async function () {
            await expect(marketplace.addPaymentToken(address0)).to.be.revertedWith("NFTMarketplace: feeRecipient_ is zero address")
        })
        it("should revert if address is already supported", async function () {
            await marketplace.addPaymentToken(samplePaymentToken.address)
            await expect(marketplace.addPaymentToken(samplePaymentToken.address)).to.be.revertedWith("NFTMarketplace: already supported")
        })
        it("should revert if sender is not contract owner", async function () {
            await expect(marketplace.connect(buyer).addPaymentToken(buyer.address)).to.be.rejectedWith("Ownable: caller is not the owner")
        })
        it("should add payment token correctly", async function () {
            await marketplace.addPaymentToken(samplePaymentToken.address)
            expect(await marketplace.isPaymentTokenSupported(samplePaymentToken.address)).to.be.equal(true)
        })
    })
    //important
    describe("addOrder", function () {
        beforeEach(async () => {
            await petty.mint(seller.address)
        })
        it("should revert if payment token not supported",async function(){})
        it("should revert if sender isn't nft owner",async function(){})
        it("should revert if nft hasn't been approve for marketplace contract",async function(){})
        it("should revert if pirce = 0",async function(){})
        it("should add order correctly",async function(){})
    })
    describe("cancelOrder", function () {
        beforeEach(async () => {
            await petty.mint(seller.address)
            await petty.connect(seller).setApprovalForAll(marketplace.address,true)
            await marketplace.connect(seller).addOrder(1,gold.address,defaultPrice)
        })
        it("should revert if order has been sold",async function(){})
        it("should revert if sender isn't order owner",async function(){})
        it("should cancel correctly",async function(){})
    })
    describe("executeOrder", function () {
        beforeEach(async () => {
            await petty.mint(seller.address)
            await petty.connect(seller).setApprovalForAll(marketplace.address,true)
            await marketplace.connect(seller).addOrder(1, gold.address, defaultPrice)
            await gold.connect(buyer).approve(marketplace.address, defaultPrice)
        })
        it("should revert if sender is seller", async function(){})
        it("should revert if order has been sold", async function(){})
        it("should revert if order has been cancel", async function(){})
        it("should execuate order correctly with default fee", async function(){})
        it("should execuate order correctly with 0 fee", async function(){})
        it("should execuate order correctly with fee 1 = 99%", async function(){})
        it("should execuate order correctly with fee 2 = 10.11111%", async function(){})
    })
})