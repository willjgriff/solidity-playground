pragma solidity ^0.4.18;

import "./ERC721.sol";

/**
 * Variation of the Dharma Protocol Non Fungible ERC721 token
 */
contract StandardNonFungibleToken is ERC721 {

    uint public totalSupply;

    mapping(uint => address) public tokenOwners;
    mapping(uint => address) public tokenApprovedAddresses;
    // Currently unused.
    mapping(uint => string) public tokenMetadata;
    mapping(address => uint[]) public ownerToTokensOwned;
    mapping(uint => uint) private tokenIdToOwnerArrayIndex;

    modifier tokenExists(uint tokenId) { require(ownerOf(tokenId) != address(0)); _; }
    
    function balanceOf(address owner) public view returns (uint256) {
        return ownerToTokensOwned[owner].length;
    }

    function ownerOf(uint tokenId) public view returns (address) {
        return tokenOwners[tokenId];
    }

    function approve(address to, uint tokenId) public tokenExists(tokenId) {
        require(msg.sender == ownerOf(tokenId));
        require(msg.sender != to);

        if (getApproved(tokenId) != address(0) || to != address(0)) {
            tokenApprovedAddresses[tokenId] = to;
            Approval(msg.sender, to, tokenId);
        }
    }

    function transferFrom(address from, address to, uint tokenId) public tokenExists(tokenId) {
        require(getApproved(tokenId) == msg.sender);
        require(ownerOf(tokenId) == from);
        require(to != address(0));

        clearApprovalAndTransfer(from, to, tokenId);

        Approval(from, 0, tokenId);
        Transfer(from, to, tokenId);
    }

    function transfer(address _to, uint _tokenId) public tokenExists(_tokenId) {
        require(ownerOf(_tokenId) == msg.sender);
        require(_to != address(0));

        clearApprovalAndTransfer(msg.sender, _to, _tokenId);

        Approval(msg.sender, 0, _tokenId);
        Transfer(msg.sender, _to, _tokenId);
    }

    // This is part of the ERC so we can't prefix it with 'get'
    function tokenOfOwnerByIndex(address owner, uint index) public view returns (uint _tokenId) {
        return ownerToTokensOwned[owner][index];
    }

    function getOwnerTokens(address _owner) public view returns (uint[]) {
        ownerToTokensOwned[_owner];
    }

    // Maybe unnecessary
    function implementsERC721() public view returns (bool) {
        return true;
    }

    function getApproved(uint tokenId) public view returns (address) {
        return tokenApprovedAddresses[tokenId];
    }

    function clearApprovalAndTransfer(address from, address to, uint tokenId) private {
        clearTokenApproval(tokenId);
        removeTokenFromOwnersList(from, tokenId);
        setTokenOwner(tokenId, to);
        addTokenToOwnersList(to, tokenId);
    }

    function clearTokenApproval(uint tokenId) private {
        tokenApprovedAddresses[tokenId] = address(0);
    }

    function removeTokenFromOwnersList(address owner, uint tokenId) private {
        uint length = ownerToTokensOwned[owner].length;
        uint index = tokenIdToOwnerArrayIndex[tokenId];
        uint swapToken = ownerToTokensOwned[owner][length - 1];

        ownerToTokensOwned[owner][index] = swapToken;
        tokenIdToOwnerArrayIndex[swapToken] = index;

        delete ownerToTokensOwned[owner][length - 1];
        ownerToTokensOwned[owner].length--;
    }

    function setTokenOwner(uint tokenId, address owner) private {
        tokenOwners[tokenId] = owner;
    }

    function addTokenToOwnersList(address owner, uint tokenId) private {
        ownerToTokensOwned[owner].push(tokenId);
        tokenIdToOwnerArrayIndex[tokenId] =
        ownerToTokensOwned[owner].length - 1;
    }
}