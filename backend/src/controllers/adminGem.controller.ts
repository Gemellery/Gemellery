import { Request, Response } from "express";
import pool from "../database";
import { mintGemOnChain, MintGemData, getBlockchainStatus } from "../services/blockchain.service";

export const getAllGemsForReview = async (req: Request, res: Response) => {
    try {
        const [rows]: any = await pool.query(`
            SELECT 
                g.gem_id,
                g.gem_name,
                g.ngja_certificate_no,
                g.ngja_certificate_url,
                g.gem_type,
                g.price,
                g.carat,
                g.color,
                g.cut,
                g.clarity,
                g.origin,
                g.verification_status,
                g.created_at,
                g.token_id,
                g.tx_hash,
                g.blockchain_status,
                g.minted_at,
                s.business_name
            FROM gem g
            JOIN seller s ON g.seller_id = s.seller_id
            ORDER BY g.verification_status ASC, g.created_at DESC
        `);

        res.json(rows);
    } catch (err) {
        console.error("Error fetching gems for review:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateGemStatus = async (req: Request, res: Response) => {
    const { gem_id } = req.params;
    const { status, admin_comment } = req.body;

    if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        // Update the gem's verification status and admin comment first
        if (status === "approved") {
            await pool.query(
                `UPDATE gem 
                 SET verification_status = ?, 
                     admin_comment = ?,
                     blockchain_status = 'pending'
                 WHERE gem_id = ?`,
                [status, admin_comment || null, gem_id]
            );
        } else {
            // If rejected, just update verification status
            await pool.query(
                `UPDATE gem 
                 SET verification_status = ?, 
                     admin_comment = ?
                 WHERE gem_id = ?`,
                [status, admin_comment || null, gem_id]
            );
            return res.json({ message: `Gem rejected successfully` });
        }

        // Fetch the gem details needed for minting
        const [gemRows]: any = await pool.query(
            `SELECT gem_name, gem_type, cut, color, clarity, origin, carat, ngja_certificate_no 
             FROM gem WHERE gem_id = ?`,
            [gem_id]
        );

        if (gemRows.length === 0) {
            return res.status(404).json({ message: "Gem not found" });
        }

        const gem = gemRows[0];

        // Mint the gem on the blockchain
        const mintData: MintGemData = {
            gemName: gem.gem_name || "Unknown",
            gemType: gem.gem_type || "Unknown",
            cut: gem.cut || "Unknown",
            color: gem.color || "Unknown",
            clarity: gem.clarity || "Unknown",
            origin: gem.origin || "Unknown",
            carat: gem.carat ? String(gem.carat) : "0",
            certificateNumber: gem.ngja_certificate_no || "N/A",
        };

        try {
            const mintResult = await mintGemOnChain(mintData);

            if (mintResult) {
                // Successfully minted on blockchain — update the gem record with token ID, tx hash, and set status to 'minted'
                await pool.query(
                    `UPDATE gem 
                     SET token_id = ?, 
                         tx_hash = ?, 
                         blockchain_status = 'minted',
                         minted_at = NOW()
                     WHERE gem_id = ?`,
                    [mintResult.tokenId, mintResult.txHash, gem_id]
                );

                return res.json({
                    message: "Gem approved and minted on blockchain successfully",
                    tokenId: mintResult.tokenId,
                    txHash: mintResult.txHash,
                });
            } else {
                await pool.query(
                    `UPDATE gem SET blockchain_status = 'none' WHERE gem_id = ?`,
                    [gem_id]
                );

                return res.json({
                    message: "Gem approved successfully (blockchain minting is disabled)",
                });
            }
        } catch (mintError: any) {
            // If minting fails, log the error and update blockchain_status to 'failed'
            console.error("Blockchain minting failed:", mintError.message);

            await pool.query(
                `UPDATE gem SET blockchain_status = 'failed' WHERE gem_id = ?`,
                [gem_id]
            );

            return res.json({
                message: "Gem approved but blockchain minting failed. You can retry minting later.",
                blockchainError: mintError.message,
            });
        }
    } catch (err) {
        console.error("Error updating gem status:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Allow admin to retry minting a gem that previously failed to mint on the blockchain
export const retryMintGem = async (req: Request, res: Response) => {
    const { gem_id } = req.params;

    try {
            const [gemRows]: any = await pool.query(
            `SELECT gem_id, gem_name, gem_type, cut, color, clarity, origin, carat, 
                    ngja_certificate_no, verification_status, blockchain_status
             FROM gem WHERE gem_id = ?`,
            [gem_id]
        );

        if (gemRows.length === 0) {
            return res.status(404).json({ message: "Gem not found" });
        }

        const gem = gemRows[0];

        // Only allow retry for approved gems with failed or pending mint
        if (gem.verification_status !== "approved") {
            return res.status(400).json({ message: "Gem must be approved before minting" });
        }

        if (gem.blockchain_status === "minted") {
            return res.status(400).json({ message: "Gem is already minted on blockchain" });
        }

        // Set status to pending
        await pool.query(
            `UPDATE gem SET blockchain_status = 'pending' WHERE gem_id = ?`,
            [gem_id]
        );

        // Attempt minting
        const mintData: MintGemData = {
            gemName: gem.gem_name || "Unknown",
            gemType: gem.gem_type || "Unknown",
            cut: gem.cut || "Unknown",
            color: gem.color || "Unknown",
            clarity: gem.clarity || "Unknown",
            origin: gem.origin || "Unknown",
            carat: gem.carat ? String(gem.carat) : "0",
            certificateNumber: gem.ngja_certificate_no || "N/A",
        };

        try {
            const mintResult = await mintGemOnChain(mintData);

            if (mintResult) {
                await pool.query(
                    `UPDATE gem 
                     SET token_id = ?, 
                         tx_hash = ?, 
                         blockchain_status = 'minted',
                         minted_at = NOW()
                     WHERE gem_id = ?`,
                    [mintResult.tokenId, mintResult.txHash, gem_id]
                );

                return res.json({
                    message: "Gem minted on blockchain successfully",
                    tokenId: mintResult.tokenId,
                    txHash: mintResult.txHash,
                });
            } else {
                await pool.query(
                    `UPDATE gem SET blockchain_status = 'none' WHERE gem_id = ?`,
                    [gem_id]
                );
                return res.json({ message: "Blockchain minting is disabled" });
            }
        } catch (mintError: any) {
            console.error("Retry minting failed:", mintError.message);

            await pool.query(
                `UPDATE gem SET blockchain_status = 'failed' WHERE gem_id = ?`,
                [gem_id]
            );

            return res.status(500).json({
                message: "Blockchain minting failed again",
                blockchainError: mintError.message,
            });
        }
    } catch (err) {
        console.error("Error retrying gem mint:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getBlockchainServiceStatus = async (req: Request, res: Response) => {
    try {
        const status = await getBlockchainStatus();
        res.json(status);
    } catch (err) {
        console.error("Error getting blockchain status:", err);
        res.status(500).json({ message: "Server error" });
    }
};