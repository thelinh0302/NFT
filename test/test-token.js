const {expect} = require('chai');
const {ethers} = require('hardhat');

describe('ERC20-BEP20 sample token', function() {
  let [accountA, accountB, accountC] = [];
  let token 
  let amount = 100
  let totalSupply = 1000000;
  
  beforeEach( async () => {
    [accountA,accountB,accountC] = await ethers.getSigners();
    const Token = await ethers.getContractFactory('SampleToken');
    token = await Token.deploy();
    await token.deployed();
  })

  describe('common',()=>{
      it('Total supply should return right value',async ()=>{
           expect(await token.totalSupply()).to.be.equal(totalSupply)
      })
      it('balance of account A should return right value',async ()=>{
          expect(await token.balanceOf(accountA.address)).to.be.equal(totalSupply)
      })
      it('balance of account B should return right value',async ()=>{
        expect(await token.balanceOf(accountB.address)).to.be.equal(0)
      })
      it('allowance of account A to account B should return right value',async ()=>{
        expect(await token.allowance(accountA.address,accountB.address)).to.be.equal(0)
      })
  })
  describe('transfer',()=>{
    it('transfer should revert if amount exceeds balance',async ()=>{
        await expect(token.transfer(accountB.address,totalSupply+1)).to.be.reverted
    })
    it('transfer should work correctly ',async ()=>{
      let transferTx = await token.transfer(accountB.address,amount)
      expect(await token.balanceOf(accountA.address)).to.be.equal(totalSupply - amount)
      expect(await token.balanceOf(accountB.address)).to.be.equal(amount)
      await expect(transferTx).to.emit(token,'Transfer').withArgs(accountA.address,accountB.address,amount)
    })
  })
  describe('transferForm',()=>{
    it('transferForm should revert if amount exceeds balance',async ()=>{
      await expect(token.connect(accountB).transferForm(accountA.address,accountC.address,totalSupply+1)).to.be.reverted
    })
    it('transferForm should revert if amount exceeds allowance balance',async ()=>{
      await expect(token.connect(accountB).transferForm(accountA.address,accountC.address,amount)).to.be.reverted
    })
    it('transferForm should work correctly ',async ()=>{
      await token.approve(accountB.address,amount);
      let transferFormTx = await token.connect(accountB).transferForm(accountA.address,accountC.address,amount)
      expect(await token.balanceOf(accountA.address)).to.be.equal(totalSupply-amount)
      expect(await token.balanceOf(accountC.address)).to.be.equal(amount)
      await expect(transferFormTx).to.emit(token,'Transfer').withArgs(accountA.address,accountC.address,amount)
    })
  })
  describe('approve',()=>{
    it('approve should work correctly ',async ()=>{
      let approveTx= await token.approve(accountB.address,amount);
      expect(await token.allowance(accountA.address,accountB.address)).to.be.equal(amount)
      await expect(approveTx).to.emit(token,'Approval').withArgs(accountA.address,accountB.address,amount)
    })
  })

})
