pragma experimental ABIEncoderV2;
pragma solidity ^0.5.1;

import "./EcTools.sol";

/**
 * Copied from MetaMask's example code for EIP 712.
 * Modified to enable verification of non-hardcoded externally signed bid through "verifySpecific(bid, signature)"
 */
contract SignatureVerifier {

    uint256 constant chainId = 1;
    address constant verifyingContract = 0x1C56346CD2A2Bf3202F771f50d3D14a367B48070;
    bytes32 constant salt = 0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558;

    string private constant EIP712_DOMAIN = "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract,bytes32 salt)";
    string private constant IDENTITY_TYPE = "Identity(uint256 userId,address wallet)";
    string private constant BID_TYPE = "Bid(uint256 amount,Identity bidder)Identity(uint256 userId,address wallet)";

    bytes32 private constant EIP712_DOMAIN_TYPEHASH = keccak256(abi.encodePacked(EIP712_DOMAIN));
    bytes32 private constant IDENTITY_TYPEHASH = keccak256(abi.encodePacked(IDENTITY_TYPE));
    bytes32 private constant BID_TYPEHASH = keccak256(abi.encodePacked(BID_TYPE));
    bytes32 private constant DOMAIN_SEPARATOR = keccak256(abi.encode(
            EIP712_DOMAIN_TYPEHASH,
            keccak256("My amazing dApp"),
            keccak256("2"),
            chainId,
            verifyingContract,
            salt
        ));

    struct Identity {
        uint256 userId;
        address wallet;
    }

    struct Bid {
        uint256 amount;
        Identity bidder;
    }

    function hashIdentity(Identity memory identity) private pure returns (bytes32) {
        return keccak256(abi.encode(
                IDENTITY_TYPEHASH,
                identity.userId,
                identity.wallet
            ));
    }

    function hashBid(Bid memory bid) public pure returns (bytes32){
        return keccak256(abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(
                    BID_TYPEHASH,
                    bid.amount,
                    hashIdentity(bid.bidder)
                ))
            ));
    }

    function verifyHardCoded() public pure returns (bool) {
        Identity memory bidder = Identity({
            userId: 323,
            wallet: 0x3333333333333333333333333333333333333333
            });

        Bid memory bid = Bid({
            amount: 100,
            bidder: bidder
            });

        bytes32 sigR = 0x4ce0d4986630fd8d74b7f21f7c610965ec6c2f7cebb50ce22f0db218e93fe608;
        bytes32 sigS = 0x1152fe28bd3db6244042a28a355b19aac2818b6ed8029822ecaa55c010ec4003;
        uint8 sigV = 27;
        address signer = 0x93889F441C03E6E8A662c9c60c750A9BfEcb00bd;

        return signer == ecrecover(hashBid(bid), sigV, sigR, sigS);
    }

    function verifySpecific(Bid memory bid, bytes memory signature) public pure returns (address) {
        return EcTools.prefixedRecover(hashBid(bid), signature);
    }
}