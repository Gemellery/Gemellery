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
                sampleGem.certificateNumber
            );

            // Wait for the transaction to be mined
            await tx.wait();

            // Check that the total minted count is now 1
            expect(await gemCertificate.totalGemsMinted()).to.equal(1);
        });

        it("should store the correct gem data on-chain", async function () {
            const tx = await gemCertificate.mintGem(
                sampleGem.gemName,
                sampleGem.gemType,
                sampleGem.cut,
                sampleGem.color,
                sampleGem.clarity,
                sampleGem.origin,
                sampleGem.carat,
                sampleGem.certificateNumber
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
            expect(gemData.mintedAt).to.be.greaterThan(0);
        });

        it("should emit a GemMinted event with correct data", async function () {
            await expect(
                gemCertificate.mintGem(
                    sampleGem.gemName,
                    sampleGem.gemType,
                    sampleGem.cut,
                    sampleGem.color,
                    sampleGem.clarity,
                    sampleGem.origin,
                    sampleGem.carat,
                    sampleGem.certificateNumber
                )
            )
                .to.emit(gemCertificate, "GemMinted")
                .withArgs(
                    1,                              // tokenId
                    sampleGem.gemName,              // gemName
                    sampleGem.gemType,              // gemType
                    sampleGem.certificateNumber,    // certificateNumber
                    (mintedAt: any) => true          // mintedAt — just verify it exists
                );
        });

        it("should increment token IDs correctly for multiple mints", async function () {
            // Mint 3 gems
            await (await gemCertificate.mintGem(
                "Gem 1", "Ruby", "Round", "Red", "VS1", "Myanmar", "1.00", "CERT-001"
            )).wait();

            await (await gemCertificate.mintGem(
                "Gem 2", "Emerald", "Square", "Green", "SI1", "Colombia", "2.00", "CERT-002"
            )).wait();

            await (await gemCertificate.mintGem(
                "Gem 3", "Diamond", "Brilliant", "White", "VVS1", "South Africa", "3.00", "CERT-003"
            )).wait();

            // Verify total count
            expect(await gemCertificate.totalGemsMinted()).to.equal(3);

            // Verify each gem's data is independent
            const gem1 = await gemCertificate.getGemData(1);
            const gem2 = await gemCertificate.getGemData(2);
            const gem3 = await gemCertificate.getGemData(3);

            expect(gem1.gemName).to.equal("Gem 1");
            expect(gem2.gemName).to.equal("Gem 2");
            expect(gem3.gemName).to.equal("Gem 3");

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
                    sampleGem.certificateNumber
                )
            ).to.be.revertedWithCustomError(gemCertificate, "OwnableUnauthorizedAccount");
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