// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract BadgeRush1155 is ERC1155, Ownable, Pausable, EIP712 {
    using ECDSA for bytes32;

    // ---- Events ----
    event BadgeMinted(address indexed user, uint256 indexed badgeId, uint256 price);
    event BadgeCreated(uint256 indexed badgeId);
    event BadgeUpdated(uint256 indexed badgeId);
    event BadgePaused(uint256 indexed badgeId, bool paused);

    // ---- Structs ----
    struct BadgeConfig {
        uint256 price;        // wei cinsinden
        uint256 maxSupply;    // 0 = sınırsız
        uint256 mintedCount;
        bool requiresUnlock;
        bool onePerWallet;
        bool active;
        bool paused;
    }

    // EIP-712 type hash
    bytes32 private constant UNLOCK_TYPEHASH = keccak256(
        "UnlockPayload(address user,uint256 badgeId,uint256 chainId,address contractAddress,bytes32 nonce,uint256 expiry)"
    );

    // ---- Storage ----
    address public signer;
    mapping(uint256 => BadgeConfig) public badges;
    mapping(uint256 => mapping(address => bool)) public hasMinted;
    mapping(bytes32 => bool) public usedNonces;
    string private _baseMetadataURI;

    constructor(address _signer, string memory baseURI)
        ERC1155(baseURI)
        Ownable(msg.sender)
        EIP712("BadgeRush", "1")
    {
        signer = _signer;
        _baseMetadataURI = baseURI;
    }

    // ---- Mint ----
    function mint(
        uint256 badgeId,
        bytes32 nonce,
        uint256 expiry,
        bytes calldata signature
    ) external payable whenNotPaused {
        BadgeConfig storage badge = badges[badgeId];

        require(badge.active,                        "Badge not active");
        require(!badge.paused,                       "Badge paused");
        require(msg.value == badge.price,            "Wrong ETH amount");
        require(block.timestamp <= expiry,           "Signature expired");
        require(!usedNonces[nonce],                  "Nonce already used");

        if (badge.maxSupply > 0) {
            require(badge.mintedCount < badge.maxSupply, "Max supply reached");
        }

        if (badge.onePerWallet) {
            require(!hasMinted[badgeId][msg.sender], "Already minted");
        }

        if (badge.requiresUnlock) {
            _verifyUnlockSignature(msg.sender, badgeId, nonce, expiry, signature);
        }

        usedNonces[nonce] = true;
        hasMinted[badgeId][msg.sender] = true;
        badge.mintedCount += 1;

        _mint(msg.sender, badgeId, 1, "");

        emit BadgeMinted(msg.sender, badgeId, msg.value);
    }

    // ---- EIP-712 Verify ----
    function _verifyUnlockSignature(
        address user,
        uint256 badgeId,
        bytes32 nonce,
        uint256 expiry,
        bytes calldata signature
    ) internal view {
        bytes32 structHash = keccak256(abi.encode(
            UNLOCK_TYPEHASH,
            user,
            badgeId,
            block.chainid,
            address(this),
            nonce,
            expiry
        ));

        bytes32 digest = _hashTypedDataV4(structHash);
        address recovered = digest.recover(signature);

        require(recovered == signer, "Invalid unlock signature");
    }

    // ---- Admin ----
    function createBadge(
        uint256 badgeId,
        uint256 price,
        uint256 maxSupply,
        bool requiresUnlock,
        bool onePerWallet
    ) external onlyOwner {
        require(!badges[badgeId].active, "Badge already exists");
        badges[badgeId] = BadgeConfig({
            price: price,
            maxSupply: maxSupply,
            mintedCount: 0,
            requiresUnlock: requiresUnlock,
            onePerWallet: onePerWallet,
            active: true,
            paused: false
        });
        emit BadgeCreated(badgeId);
    }

    function updateBadgePrice(uint256 badgeId, uint256 newPrice) external onlyOwner {
        badges[badgeId].price = newPrice;
        emit BadgeUpdated(badgeId);
    }

    function setBadgePaused(uint256 badgeId, bool paused) external onlyOwner {
        badges[badgeId].paused = paused;
        emit BadgePaused(badgeId, paused);
    }

    function setSigner(address newSigner) external onlyOwner {
        signer = newSigner;
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");
        (bool ok, ) = owner().call{value: balance}("");
        require(ok, "Withdraw failed");
    }

    function uri(uint256 badgeId) public view override returns (string memory) {
        return string(abi.encodePacked(_baseMetadataURI, "/", badgeId, ".json"));
    }
}
