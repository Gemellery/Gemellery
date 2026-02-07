// Run this script to create the jewelry_designs table
// Usage: npx ts-node src/scripts/create-jewelry-table.ts

import pool from "../database";

const createTableSQL = `
CREATE TABLE IF NOT EXISTS jewelry_designs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  gem_type VARCHAR(50) NOT NULL,
  gem_cut VARCHAR(50) NOT NULL,
  gem_size_mode ENUM('simple', 'advanced') NOT NULL DEFAULT 'simple',
  gem_size_simple VARCHAR(20),
  gem_size_length_mm DECIMAL(10,2),
  gem_size_width_mm DECIMAL(10,2),
  gem_size_height_mm DECIMAL(10,2),
  gem_size_carat DECIMAL(10,2),
  gem_color VARCHAR(50) NOT NULL,
  gem_transparency VARCHAR(50) NOT NULL,
  gem_image_url TEXT,
  design_prompt TEXT NOT NULL,
  materials JSON NOT NULL,
  generated_images JSON NOT NULL,
  selected_image_url TEXT,
  refinements JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

async function createTable() {
    try {
        console.log("Creating jewelry_designs table...");
        await pool.query(createTableSQL);
        console.log("✅ Table created successfully!");

        // Verify table exists
        const [rows]: any = await pool.query("DESCRIBE jewelry_designs");
        console.log(`\n📋 Table has ${rows.length} columns:`);
        rows.forEach((row: any) => {
            console.log(`   - ${row.Field} (${row.Type})`);
        });

        process.exit(0);
    } catch (error: any) {
        if (error.code === "ER_TABLE_EXISTS_ERROR") {
            console.log("⚠️ Table already exists!");
        } else {
            console.error("❌ Error creating table:", error.message);
        }
        process.exit(1);
    }
}

createTable();
