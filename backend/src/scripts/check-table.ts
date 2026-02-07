import pool from "../database";

async function checkTable() {
    const [rows]: any = await pool.query("DESCRIBE jewelry_designs");
    console.log("Columns in jewelry_designs table:");
    rows.forEach((r: any) => console.log(`  - ${r.Field}`));
    process.exit(0);
}

checkTable();
