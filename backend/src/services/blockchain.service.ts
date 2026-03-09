import { ethers } from "ethers";
const GemCertificateABI = require("../contracts/GemCertificate.json");

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface MintGemData {
    gemName: string;
    gemType: string;
    cut: string;
    color: string;
    clarity: string;
    origin: string;
    carat: string;
    certificateNumber: string;
}

export interface MintResult {
    tokenId: number;
    txHash: string;
}

// ==========================================
// CONFIGURATION & INITIALIZATION
// ==========================================

const BLOCKCHAIN_ENABLED = process.env.BLOCKCHAIN_ENABLED === "true";
const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || "";
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY || "";
const CONTRACT_ADDRESS = process.env.GEM_CONTRACT_ADDRESS || "";

let provider: ethers.JsonRpcProvider | null = null;
let wallet: ethers.Wallet | null = null;
let contract: ethers.Contract | null = null;

function getContract(): ethers.Contract {
    // Return cached instance if already initialized
    if (contract) return contract;

    // Validate environment variables
    if (!RPC_URL) {
        throw new Error("BLOCKCHAIN_RPC_URL is not set in .env");
    }
    if (!PRIVATE_KEY) {
        throw new Error("BLOCKCHAIN_PRIVATE_KEY is not set in .env");
    }
    if (!CONTRACT_ADDRESS) {
        throw new Error("GEM_CONTRACT_ADDRESS is not set in .env");
    }

    //Provider (the connection to the Ethereum network)
    provider = new ethers.JsonRpcProvider(RPC_URL);

    //Create a wallet
    wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    //Create a contract instance
    contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        GemCertificateABI.abi,
        wallet
    );

    console.log("Blockchain service initialized");
    console.log(`   Contract: ${CONTRACT_ADDRESS}`);
    console.log(`   Wallet:   ${wallet.address}`);
    console.log(`   Network:  ${RPC_URL.includes("sepolia") ? "Sepolia Testnet" : "Unknown"}`);

    return contract;
}

// ==========================================
// MAIN FUNCTIONS
// ==========================================
export async function mintGemOnChain(data: MintGemData): Promise<MintResult | null> {
    if (!BLOCKCHAIN_ENABLED) {
        console.log("[WARN] Blockchain is disabled (BLOCKCHAIN_ENABLED=false). Skipping mint.");
        return null;
    }

    // Get the contract instance (initializes on first call)
    const gemContract = getContract();

    console.log(`[INFO] Minting gem on blockchain: "${data.gemName}" (${data.certificateNumber})`);

    const tx = await gemContract.mintGem(
        data.gemName,
        data.gemType,
        data.cut,
        data.color,
        data.clarity,
        data.origin,
        data.carat,
        data.certificateNumber
    );

    console.log(`[INFO] Transaction sent: ${tx.hash}`);
    console.log(`       Waiting for confirmation...`);

    // Wait for the transaction to be mined and get the receipt
    const receipt = await tx.wait();

    if (!receipt || receipt.status === 0) {
        throw new Error("Transaction failed on-chain (receipt status = 0)");
    }

    console.log(`[SUCCESS] Transaction confirmed in block ${receipt.blockNumber}`);

    // The GemMinted event should be emitted by the contract when minting is successful.
    let tokenId: number = 0;

    for (const log of receipt.logs) {
        try {
            const parsedLog = gemContract.interface.parseLog({
                topics: log.topics as string[],
                data: log.data,
            });

            // Check if this log is the GemMinted event
            if (parsedLog && parsedLog.name === "GemMinted") {
                tokenId = Number(parsedLog.args[0]);
                break;
            }
        } catch {
            continue;
        }
    }

    if (tokenId === 0) {
        throw new Error("GemMinted event not found in transaction receipt");
    }

    console.log(`[SUCCESS] Gem minted successfully!`);
    console.log(`          Token ID: ${tokenId}`);
    console.log(`          TX Hash:  ${tx.hash}`);

    return {
        tokenId,
        txHash: tx.hash,
    };
}

export async function getBlockchainStatus(): Promise<{
    enabled: boolean;
    connected: boolean;
    contractAddress: string;
    walletAddress: string;
    network: string;
    totalGemsMinted: number;
}> {
    if (!BLOCKCHAIN_ENABLED) {
        return {
            enabled: false,
            connected: false,
            contractAddress: "",
            walletAddress: "",
            network: "",
            totalGemsMinted: 0,
        };
    }

    try {
        const gemContract = getContract();
        const network = await provider!.getNetwork();
        const totalMinted = await gemContract.totalGemsMinted();

        return {
            enabled: true,
            connected: true,
            contractAddress: CONTRACT_ADDRESS,
            walletAddress: wallet!.address,
            network: network.name,
            totalGemsMinted: Number(totalMinted),
        };
    } catch (error) {
        return {
            enabled: true,
            connected: false,
            contractAddress: CONTRACT_ADDRESS,
            walletAddress: "",
            network: "",
            totalGemsMinted: 0,
        };
    }
}