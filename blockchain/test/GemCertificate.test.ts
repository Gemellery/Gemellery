import { expect } from "chai";
import hre from "hardhat";
import { GemCertificate } from "../typechain-types";

describe("GemCertificate", function () {

    // These variables are shared across tests in this describe block
    let gemCertificate: any;
    let owner: any;
    let otherAccount: any;

    beforeEach(async function () {
        [owner, otherAccount] = await hre.ethers.getSigners();

        // Deploy the contract
        const GemCertificateFactory = await hre.ethers.getContractFactory("GemCertificate");
        gemCertificate = await GemCertificateFactory.deploy(owner.address);

        // Wait for the deployment transaction to be mined
        await gemCertificate.waitForDeployment();
    });

    // ==========================================
    // DEPLOYMENT TESTS
    // ==========================================

    describe("Deployment", function () {
        it("should set the correct NFT name and symbol", async function () {
            expect(await gemCertificate.name()).to.equal("GemCertificate");
            expect(await gemCertificate.symbol()).to.equal("GCEM");
        });

        it("should set the correct owner", async function () {
            expect(await gemCertificate.owner()).to.equal(owner.address);
        });

        it("should start with 0 gems minted", async function () {
            expect(await gemCertificate.totalGemsMinted()).to.equal(0);
        });

        it("should report next token ID as 1", async function () {
            expect(await gemCertificate.getNextTokenId()).to.equal(1);
        });
    });

    // ==========================================
    // MINTING TESTS
    // ==========================================

    describe("Minting", function () {

        const sampleGem = {
            gemName: "Blue Kashmir Sapphire",
            gemType: "Sapphire",
            cut: "Oval",
            color: "Blue",
            clarity: "VS1",
            origin: "Sri Lanka",
            carat: "2.45",
            certificateNumber: "NGJA-2024-001234",
            sellerName: "Royal Gems Lanka",
        };

        it("should mint a gem and assign token ID 1", async function () {
            const tx = await gemCertificate.mintGem(
                sampleGem.gemName,
                sampleGem.gemType,
                sampleGem.cut,
                sampleGem.color,
                sampleGem.clarity,
                sampleGem.origin,
                sampleGem.carat,
                sampleGem.certificateNumber,
                sampleGem.sellerName
            );

            // Wait for the transaction to be mined
            await tx.wait();

            // Check that the total minted count is now 1
            expect(await gemCertificate.totalGemsMinted()).to.equal(1);
        });

        it("should store the correct gem data on-chain including sellerName", async function () {
            const tx = await gemCertificate.mintGem(
                sampleGem.gemName,
                sampleGem.gemType,
                sampleGem.cut,
                sampleGem.color,
                sampleGem.clarity,
                sampleGem.origin,
                sampleGem.carat,
                sampleGem.certificateNumber,
                sampleGem.sellerName
            );
            await tx.wait();

            // getGemData returns the struct — ethers.js converts it to an array-like object
            const gemData = await gemCertificate.getGemData(1);

            expect(gemData.gemName).to.equal(sampleGem.gemName);
            expect(gemData.gemType).to.equal(sampleGem.gemType);
            expect(gemData.cut).to.equal(sampleGem.cut);
            expect(gemData.color).to.equal(sampleGem.color);
            expect(gemData.clarity).to.equal(sampleGem.clarity);
            expect(gemData.origin).to.equal(sampleGem.origin);
            expect(gemData.carat).to.equal(sampleGem.carat);
            expect(gemData.certificateNumber).to.equal(sampleGem.certificateNumber);
            expect(gemData.sellerName).to.equal(sampleGem.sellerName);
            expect(gemData.mintedAt).to.be.greaterThan(0);
        });

        it("should emit a GemMinted event with correct data including sellerName", async function () {
            await expect(
                gemCertificate.mintGem(
                    sampleGem.gemName,
                    sampleGem.gemType,
                    sampleGem.cut,
                    sampleGem.color,
                    sampleGem.clarity,
                    sampleGem.origin,
                    sampleGem.carat,
                    sampleGem.certificateNumber,
                    sampleGem.sellerName
                )
            )
                .to.emit(gemCertificate, "GemMinted")
                .withArgs(
                    1,                              // tokenId
                    sampleGem.gemName,              // gemName
                    sampleGem.gemType,              // gemType
                    sampleGem.certificateNumber,    // certificateNumber
                    sampleGem.sellerName,           // sellerName
                    (mintedAt: any) => true          // mintedAt — just verify it exists
                );
        });

        it("should increment token IDs correctly for multiple mints", async function () {
            // Mint 3 gems
            await (await gemCertificate.mintGem(
                "Gem 1", "Ruby", "Round", "Red", "VS1", "Myanmar", "1.00", "CERT-001", "Seller A"
            )).wait();

            await (await gemCertificate.mintGem(
                "Gem 2", "Emerald", "Square", "Green", "SI1", "Colombia", "2.00", "CERT-002", "Seller B"
            )).wait();

            await (await gemCertificate.mintGem(
                "Gem 3", "Diamond", "Brilliant", "White", "VVS1", "South Africa", "3.00", "CERT-003", "Seller C"
            )).wait();

            // Verify total count
            expect(await gemCertificate.totalGemsMinted()).to.equal(3);

            // Verify each gem's data is independent
            const gem1 = await gemCertificate.getGemData(1);
            const gem2 = await gemCertificate.getGemData(2);
            const gem3 = await gemCertificate.getGemData(3);

            expect(gem1.gemName).to.equal("Gem 1");
            expect(gem1.sellerName).to.equal("Seller A");
            expect(gem2.gemName).to.equal("Gem 2");
            expect(gem2.sellerName).to.equal("Seller B");
            expect(gem3.gemName).to.equal("Gem 3");
            expect(gem3.sellerName).to.equal("Seller C");

            // Next token ID should be 4
            expect(await gemCertificate.getNextTokenId()).to.equal(4);
        });

        it("should reject minting from non-owner accounts", async function () {
            
            await expect(
                gemCertificate.connect(otherAccount).mintGem(
                    sampleGem.gemName,
                    sampleGem.gemType,
                    sampleGem.cut,
                    sampleGem.color,
                    sampleGem.clarity,
                    sampleGem.origin,
                    sampleGem.carat,
                    sampleGem.certificateNumber,
                    sampleGem.sellerName
                )
            ).to.be.revertedWithCustomError(gemCertificate, "OwnableUnauthorizedAccount");
        });
    });

    // ==========================================
    // TRANSFER TESTS
    // ==========================================

    describe("Transfer to Buyer", function () {

        const sampleGem = {
            gemName: "Blue Kashmir Sapphire",
            gemType: "Sapphire",
            cut: "Oval",
            color: "Blue",
            clarity: "VS1",
            origin: "Sri Lanka",
            carat: "2.45",
            certificateNumber: "NGJA-2024-001234",
            sellerName: "Royal Gems Lanka",
        };

        beforeEach(async function () {
            // Mint a gem first so we have something to transfer
            const tx = await gemCertificate.mintGem(
                sampleGem.gemName,
                sampleGem.gemType,
                sampleGem.cut,
                sampleGem.color,
                sampleGem.clarity,
                sampleGem.origin,
                sampleGem.carat,
                sampleGem.certificateNumber,
                sampleGem.sellerName
            );
            await tx.wait();
        });

        it("should transfer an NFT from the contract to a buyer", async function () {
            const contractAddress = await gemCertificate.getAddress();

            // Before transfer: contract owns it
            expect(await gemCertificate.ownerOf(1)).to.equal(contractAddress);

            // Transfer to buyer (otherAccount)
            await gemCertificate.transferGemToBuyer(1, otherAccount.address);

            // After transfer: buyer owns it
            expect(await gemCertificate.ownerOf(1)).to.equal(otherAccount.address);
        });

        it("should emit a GemTransferred event", async function () {
            const contractAddress = await gemCertificate.getAddress();

            await expect(
                gemCertificate.transferGemToBuyer(1, otherAccount.address)
            )
                .to.emit(gemCertificate, "GemTransferred")
                .withArgs(
                    1,                          // tokenId
                    contractAddress,            // from (contract)
                    otherAccount.address,       // to (buyer)
                    (transferredAt: any) => true // timestamp
                );
        });

        it("should reject transfer from non-owner accounts", async function () {
            await expect(
                gemCertificate.connect(otherAccount).transferGemToBuyer(1, otherAccount.address)
            ).to.be.revertedWithCustomError(gemCertificate, "OwnableUnauthorizedAccount");
        });

        it("should reject transfer to zero address", async function () {
            await expect(
                gemCertificate.transferGemToBuyer(1, "0x0000000000000000000000000000000000000000")
            ).to.be.revertedWith("GemCertificate: cannot transfer to zero address");
        });

        it("should reject transfer of non-existent token", async function () {
            await expect(
                gemCertificate.transferGemToBuyer(999, otherAccount.address)
            ).to.be.revertedWith("GemCertificate: token does not exist");
        });

        it("should reject transfer if token is already transferred", async function () {
            // Transfer once
            await gemCertificate.transferGemToBuyer(1, otherAccount.address);

            // Try to transfer again — should fail because the contract no longer owns it
            await expect(
                gemCertificate.transferGemToBuyer(1, otherAccount.address)
            ).to.be.revertedWith("GemCertificate: token not held by contract");
        });

        it("should preserve gem data after transfer", async function () {
            // Transfer the gem
            await gemCertificate.transferGemToBuyer(1, otherAccount.address);

            // Gem data should still be readable
            const gemData = await gemCertificate.getGemData(1);
            expect(gemData.gemName).to.equal(sampleGem.gemName);
            expect(gemData.sellerName).to.equal(sampleGem.sellerName);
        });
    });

    // ==========================================
    // GETTER TESTS
    // ==========================================

    describe("Getters", function () {
        it("should revert when querying a non-existent token", async function () {
            // Token ID 999 was never minted
            await expect(
                gemCertificate.getGemData(999)
            ).to.be.revertedWith("GemCertificate: token does not exist");
        });

        it("should revert when querying token ID 0", async function () {
            // Token IDs start at 1, so 0 is invalid
            await expect(
                gemCertificate.getGemData(0)
            ).to.be.revertedWith("GemCertificate: token does not exist");
        });
    });
});