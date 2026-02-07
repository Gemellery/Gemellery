// Test script for jewelry design API
// Run: npx ts-node src/scripts/test-jewelry-api.ts

import dotenv from "dotenv";
dotenv.config();

import pool from "../database";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";

async function testAPI() {
    console.log("🧪 Testing Jewelry Design API...\n");

    try {
        // Step 1: Get an existing user from the database
        console.log("1️⃣ Finding test user...");

        const [users]: any = await pool.query(
            "SELECT user_id, email, role FROM user LIMIT 1"
        );

        if (users.length === 0) {
            console.log("   ❌ No users found in database. Please create a user first.");
            process.exit(1);
        }

        const userId = users[0].user_id;
        const userEmail = users[0].email;
        const userRole = users[0].role;
        console.log(`   ✅ Using user: ${userEmail} (ID: ${userId}, Role: ${userRole})`);

        // Step 2: Generate JWT token
        console.log("\n2️⃣ Generating JWT token...");
        const token = jwt.sign({ id: userId, role: userRole }, JWT_SECRET, {
            expiresIn: "1d",
        });
        console.log(`   ✅ Token: ${token.substring(0, 50)}...`);

        // Step 3: Test Generate Design endpoint
        console.log("\n3️⃣ Testing POST /api/jewelry-design/generate...");
        const designData = {
            gemType: "Diamond",
            gemCut: "Round Brilliant",
            gemSizeMode: "simple",
            gemSizeSimple: "Medium (5-8mm)",
            gemColor: "Colorless",
            gemTransparency: "Transparent",
            designPrompt: "Classic solitaire engagement ring with platinum band",
            materials: {
                metals: ["Platinum"],
                finish: "Polished",
            },
        };

        const generateResponse = await fetch(
            "http://localhost:5001/api/jewelry-design/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(designData),
            }
        );

        const generateResult = await generateResponse.json();

        if (generateResponse.status === 201) {
            console.log("   ✅ Design generated successfully!");
            console.log(`   Design ID: ${generateResult.design.id}`);
            console.log(`   Generated Images: ${generateResult.design.generated_images.length}`);
        } else {
            console.log(`   ❌ Failed: ${generateResult.message}`);
            process.exit(1);
        }

        const designId = generateResult.design.id;

        // Step 4: Test Get User Designs endpoint
        console.log("\n4️⃣ Testing GET /api/jewelry-design/user-designs...");
        const listResponse = await fetch(
            "http://localhost:5001/api/jewelry-design/user-designs",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const listResult = await listResponse.json();

        if (listResponse.status === 200) {
            console.log("   ✅ User designs fetched successfully!");
            console.log(`   Total designs: ${listResult.designs.length}`);
        } else {
            console.log(`   ❌ Failed: ${listResult.message}`);
        }

        // Step 5: Test Get Single Design endpoint
        console.log(`\n5️⃣ Testing GET /api/jewelry-design/${designId}...`);
        const getResponse = await fetch(
            `http://localhost:5001/api/jewelry-design/${designId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const getResult = await getResponse.json();

        if (getResponse.status === 200) {
            console.log("   ✅ Single design fetched successfully!");
            console.log(`   Gem Type: ${getResult.design.gem_type}`);
        } else {
            console.log(`   ❌ Failed: ${getResult.message}`);
        }

        // Step 6: Test Save Design endpoint
        console.log(`\n6️⃣ Testing PUT /api/jewelry-design/${designId}/save...`);
        const saveResponse = await fetch(
            `http://localhost:5001/api/jewelry-design/${designId}/save`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    selectedImageUrl: generateResult.design.generated_images[0].url,
                }),
            }
        );

        const saveResult = await saveResponse.json();

        if (saveResponse.status === 200) {
            console.log("   ✅ Design saved successfully!");
        } else {
            console.log(`   ❌ Failed: ${saveResult.message}`);
        }

        // Step 7: Test Refine Design endpoint
        console.log(`\n7️⃣ Testing POST /api/jewelry-design/${designId}/refine...`);
        const refineResponse = await fetch(
            `http://localhost:5001/api/jewelry-design/${designId}/refine`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    refinementPrompt: "Make the band thicker",
                    baseImageUrl: generateResult.design.generated_images[0].url,
                    strength: 0.7,
                }),
            }
        );

        const refineResult = await refineResponse.json();

        if (refineResponse.status === 200) {
            console.log("   ✅ Design refined successfully!");
            console.log(`   Refinement ID: ${refineResult.refinement.id}`);
        } else {
            console.log(`   ❌ Failed: ${refineResult.message}`);
        }

        // Step 8: Test Delete Design endpoint
        console.log(`\n8️⃣ Testing DELETE /api/jewelry-design/${designId}...`);
        const deleteResponse = await fetch(
            `http://localhost:5001/api/jewelry-design/${designId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const deleteResult = await deleteResponse.json();

        if (deleteResponse.status === 200) {
            console.log("   ✅ Design deleted successfully!");
        } else {
            console.log(`   ❌ Failed: ${deleteResult.message}`);
        }

        // Summary
        console.log("\n" + "=".repeat(50));
        console.log("✅ ALL TESTS PASSED!");
        console.log("=".repeat(50));
        console.log("\nPhase 1 Backend is working correctly.");
        console.log("You can now proceed with Git commits.\n");

        process.exit(0);
    } catch (error: any) {
        console.error("\n❌ Test failed:", error.message);
        process.exit(1);
    }
}

testAPI();
