pragma solidity ^0.4.18;


contract ERC721 {

    // ERC20
//    function name() public view returns (string);
//    function symbol() public view returns (string);
//    function totalSupply() public view returns (uint256 _totalSupply);
    function balanceOf(address _owner) public view returns (uint256 _balance);
    function ownerOf(uint _tokenId) public view returns (address _owner);
    function approve(address _to, uint _tokenId) public;
    function transferFrom(address _from, address _to, uint _tokenId) public;
    function transfer(address _to, uint _tokenId) public;

    // ERC721
    function implementsERC721() public view returns (bool);
    function tokenOfOwnerByIndex(address _owner, uint _index) public view returns (uint);
//    function tokenMetadata(uint _tokenId) public view returns (string);

    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);
}
