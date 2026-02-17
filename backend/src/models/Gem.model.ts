import pool from '../database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface GemRow extends RowDataPacket {
  gem_id: number;
  seller_id: number;
  gem_name: string;
  gem_type: string;
  price: number;
  color: string;
  cut: string;
  carat: number;
  clarity: string;
  origin: string;
  description: string;
  ngia_certificate_no: string;
  ngia_certificate_url: string;
  status: string;
  updated_date: Date;
}

export interface GemWithImages extends GemRow {
  images: Array<{
    image_id: number;
    image_url: string;
  }>;
}

export const gemModel = {
  // Get all gems with pagination and filters
  async getGems(
    limit: number = 10,
    offset: number = 0,
    filters?: {
      type?: string;
      minPrice?: number;
      maxPrice?: number;
      color?: string;
      origin?: string;
    }
  ): Promise<GemRow[]> {
    let query = 'SELECT * FROM gem WHERE status = "available"';
    const params: any[] = [];

    if (filters?.type) {
      query += ' AND gem_type = ?';
      params.push(filters.type);
    }
    if (filters?.minPrice) {
      query += ' AND price >= ?';
      params.push(filters.minPrice);
    }
    if (filters?.maxPrice) {
      query += ' AND price <= ?';
      params.push(filters.maxPrice);
    }
    if (filters?.color) {
      query += ' AND color = ?';
      params.push(filters.color);
    }
    if (filters?.origin) {
      query += ' AND origin = ?';
      params.push(filters.origin);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query<GemRow[]>(query, params);
    return rows;
  },

  // Get single gem by ID with images
  async getGemById(gemId: number): Promise<GemWithImages | null> {
    const [gemRows] = await pool.query<GemRow[]>(
      'SELECT * FROM gem WHERE gem_id = ? AND status = "available"',
      [gemId]
    );

    if (gemRows.length === 0) return null;

    const gem = gemRows[0];
    const [imageRows] = await pool.query<any[]>(
      'SELECT image_id, image_url FROM gem_images WHERE gem_id = ?',
      [gemId]
    );

    return {
      ...gem,
      images: imageRows,
    };
  },

  // Get gems by type(s)
  async getGemsByTypes(types: string[]): Promise<GemRow[]> {
    const placeholders = types.map(() => '?').join(',');
    const [rows] = await pool.query<GemRow[]>(
      `SELECT * FROM gem WHERE gem_type IN (${placeholders}) AND status = "available"`,
      types
    );
    return rows;
  },

  // Search gems by name or description
  async searchGems(query: string, limit: number = 10, offset: number = 0): Promise<GemRow[]> {
    const searchTerm = `%${query}%`;
    const [rows] = await pool.query<GemRow[]>(
      `SELECT * FROM gem 
       WHERE (gem_name LIKE ? OR description LIKE ? OR origin LIKE ?) 
       AND status = "available"
       LIMIT ? OFFSET ?`,
      [searchTerm, searchTerm, searchTerm, limit, offset]
    );
    return rows;
  },

  // Get gems by seller ID
  async getGemsBySeller(sellerId: number, limit: number = 10, offset: number = 0): Promise<GemRow[]> {
    const [rows] = await pool.query<GemRow[]>(
      'SELECT * FROM gem WHERE seller_id = ? LIMIT ? OFFSET ?',
      [sellerId, limit, offset]
    );
    return rows;
  },

  // Get gem count (for pagination)
  async getGemCount(filters?: {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    color?: string;
    origin?: string;
  }): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM gem WHERE status = "available"';
    const params: any[] = [];

    if (filters?.type) {
      query += ' AND gem_type = ?';
      params.push(filters.type);
    }
    if (filters?.minPrice) {
      query += ' AND price >= ?';
      params.push(filters.minPrice);
    }
    if (filters?.maxPrice) {
      query += ' AND price <= ?';
      params.push(filters.maxPrice);
    }
    if (filters?.color) {
      query += ' AND color = ?';
      params.push(filters.color);
    }
    if (filters?.origin) {
      query += ' AND origin = ?';
      params.push(filters.origin);
    }

    const [rows] = await pool.query<any[]>(query, params);
    return rows[0].count;
  },
};