// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Marketplace is Ownable {
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.AddressSet;
    struct Order {
        address seller;
        address buyer;
        uint256 tokenId;
        address paymentToken;
        uint256 price;
    }
    Counters.Counter private _orderIdCount;
    IERC721 public immutable nftContract;
    mapping(uint256=>Order) orders;
     uint256 public feeDecimal;
    uint256 public feeRate;
    address public feeRecipient;
    EnumerableSet.AddressSet private _supportedPaymentTokens;
    event OrderAdded(
        uint256 indexed orderId,
        address indexed seller,
        uint256 indexed tokenId,
        address paymentToken,
        uint256 price
    );
    event OrderCancelled(
        uint256 indexed orderId
    );
    event OrderMatched(
        uint256 indexed orderId,
        address indexed seller,
        address indexed buyer,
        uint256 tokenId,
        address paymentToken,
        uint256 price
    );

    event FeeRateUpdated(
        uint256 feeDecimal,
        uint256 feeRate
    );

    constructor(address nftAddress_,
        uint256 feeDecimal_,
        uint256 feeRate_,
        address feeRecipient_)
    {
        require(nftAddress_ != address(0),"NFTMarketplace: nftAddress_ is zero address");
        require(feeRecipient_ != address(0),"NFTMarketplace: feeRecipient_ is zero address");     
        nftContract = IERC721(nftAddress_);
        feeRecipient =feeRecipient_;
        feeDecimal = feeDecimal_;
        feeRate = feeRate_;
        _orderIdCount.increment();  
    }

}