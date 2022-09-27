const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('ERC20-Gold token', () => {
    let [accountA, accountB, accountC] = [];
    let token
    let amount = ethers.utils.parseUnits("100", "ether")
    let totalSupply = ethers.utils.parseEther("1000000", "ether")
    beforeEach(async () => {
        [accountA, accountB, accountC] = await ethers.getSigners()
        const Token = await ethers.getContractFactory('Gold')
        token = await Token.deploy()
        await token.deployed();
    })

    describe('common', () => {
        it('Total supply should return right value', async () => {
            expect(await token.totalSupply()).to.be.equal(totalSupply)
        })

        it('balance of account A should return right value', async () => {
            expect(await token.balanceOf(accountA.address)).to.be.equal(totalSupply)
        })

        it('balance of account B should return right value', async () => {
            expect(await token.balanceOf(accountB.address)).to.be.equal(0)
        })

        it('allowance of account A to account B should return right value', async () => {
            expect(await token.allowance(accountA.address,accountB.address)).to.be.equal(0)
        })
    })
    describe('pause()', () => {
        it('should revert if not pause role', async () => {
            await expect(token.connect(accountB).pause()).to.be.reverted
        })

        it('should revert if constract has been pause', async () => {
            await token.pause();
            await expect(token.pause()).to.be.revertedWith('Pausable: paused')
        })

        it('should pause work correctly', async () => {
            let pauseTx = await token.pause();
            await expect(pauseTx).to.be.emit(token, 'Paused').withArgs(accountA.address)
            await expect(token.transfer(accountB.address, amount)).to.be.revertedWith('Pausable: paused')
        })
    })
    describe('unpause()',()=>{
        beforeEach( async ()=>{
            await token.pause()
        })
        it('should revert if not pauser role', async()=>{
            await expect(token.connect(accountB).unpause()).to.be.reverted
        })
        it('should revert if contract has been unpause', async()=>{
            await token.unpause()
            await expect(token.unpause()).to.be.revertedWith('Pausable: not paused')
        })
        it('should pause contract correctly', async ()=>{
            const unpauseTx = await token.unpause();
            await expect(unpauseTx).to.be.emit(token,'Unpaused').withArgs(accountA.address)
            let transferTx = await token.transfer(accountB.address, amount)
            await expect(transferTx).to.be.emit(token,'Transfer').withArgs(accountA.address,accountB.address,amount)
        })
    })

    describe('addToBlackList()',()=>{
        it('should revert in case add sender to blacklist',async ()=>{
            await expect(token.addToBlackList(accountA.address)).to.be.revertedWith('Gold: must not add sender to blacklist')
        })
        
    })


})
