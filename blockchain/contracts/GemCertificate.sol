// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Import OpenZeppelin contracts
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GemCertificate is ERC721, Ownable {

    // ==========================================
    // STATE VARIABLES
    // ==========================================
    uint256 private _nextTokenId;

    struct GemData {
        string gemName;
        string gemType;
        string cut;
        string color; 
        string clarity;
        string origin;
        string carat;
        string certificateNumber;
        uint256 mintedAt;
    }

    mapping(uint256 => GemData) private _gemData;

    // ==========================================
    // EVENTS
    // ==========================================

    event GemMinted(
        uint256 indexed tokenId,
        string gemName,
        string gemType,
        string certificateNumber,
        uint256 mintedAt
    );

    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    constructor(address initialOwner) 
        ERC721("GemCertificate", "GCEM") 
        Ownable(initialOwner) 
    {
        // _nextTokenId starts at 0 by default (Solidity uint256 default)
        // First mint will increment to 1, so token IDs start at 1
    }

    // ==========================================
    // MAIN FUNCTIONS
    // ==========================================

    function mintGem(
        string calldata gemName,
        string calldata gemType,
        string calldata cut,
        string calldata color,
        string calldata clarity,
        string calldata origin,
        string calldata carat,
        string calldata certificateNumber
    ) external onlyOwner returns (uint256) {
        _nextTokenId++;
        uint256 newTokenId = _nextTokenId;
        _mint(address(this), newTokenId);

        // Store the gem's data permanently on-chain
        _gemData[newTokenId] = GemData({
            gemName: gemName,
            gemType: gemType,
            cut: cut,
            color: color,
            clarity: clarity,
            origin: origin,
            carat: carat,
            certificateNumber: certificateNumber,
            mintedAt: block.timestamp
        });

        emit GemMinted(
            newTokenId,
            gemName,
            gemType,
            certificateNumber,
            block.timestamp
        );

        return newTokenId;
    }

    function getGemData(uint256 tokenId) external view returns (GemData memory) {
        // Check that this token actually exists
        require(tokenId > 0 && tokenId <= _nextTokenId, "GemCertificate: token does not exist");
        return _gemData[tokenId];
    }

    function totalGemsMinted() external view returns (uint256) {
        return _nextTokenId;
    }

    function getNextTokenId() external view returns (uint256) {
        return _nextTokenId + 1;
    }
}