import { Request, Response } from "express";
import pool from "../database";

export const getCountries = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query(
            "SELECT country_id, country_name FROM country ORDER BY country_name"
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to load countries" });
    }
};
