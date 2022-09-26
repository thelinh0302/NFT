// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./IERC20.sol";

contract SampleToken is IERC20 {
  constructor(){
    _totalSupply = 1000000;
    _balances[msg.sender] = 1000000;

  }
  
  uint256 private _totalSupply;
  mapping(address=>uint256) private _balances;
  //mapping[sender][spender] => _allownaces;
  mapping(address=>mapping(address=>uint256)) private _allowances;
  

  function totalSupply() public view override returns(uint256){
    return _totalSupply;
  }

  function balanceOf(address account) public view override returns(uint256){
    return _balances[account];
  }

  function transfer(address recipent, uint256 amount) public override returns(bool){
    require(_balances[msg.sender] >= amount);

    _balances[msg.sender] -= amount;
    _balances[recipent] += amount;
    
    emit Transfer(msg.sender, recipent, amount);

    return true;
  }

  function transferForm(address sender, address recipent, uint256 amount) public override returns(bool){

    require(_balances[sender] >= amount);
    require(_allowances[sender][msg.sender] >= amount);

    _balances[sender] -= amount;
    _balances[recipent] += amount;

    emit Transfer(sender, recipent, amount);

    return true;
  }

  function approve(address spender,uint256 amount) public  override returns(bool){
    _allowances[msg.sender][spender] = amount;

    emit Approval(msg.sender, spender, amount);

    return true;
  }

  function allowance(address owner, address spender)public view override returns(uint256){
    return _allowances[owner][spender];
  }


}
