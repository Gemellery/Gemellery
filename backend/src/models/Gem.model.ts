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
  seller_name?: string;
  seller_email?: string;
  verification_status?: string;
}

export interface FilterParams {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  origin?: string;
  clarity?: string;
  search?: string;
  certification?: string;
  treatment?: string;
  sellerVerification?: string;
}

export const gemModel = {
  // Get all gems with pagination and filters
  async getGems(
    limit: number = 10,
    offset: number = 0,
    filters?: FilterParams
  ): Promise<GemWithImages[]> {
    let query = `
      SELECT 
        g.gem_id,
        g.seller_id,
        g.gem_name,
        g.gem_type,
        g.price,
        g.color,
        g.cut,
        g.carat,
        g.clarity,
        g.origin,
        g.description,
        g.ngia_certificate_no,
        g.ngia_certificate_url,
        g.status,
        g.updated_date,
        u.full_name as seller_name,
        u.email as seller_email,
        s.verification_status,
        GROUP_CONCAT(gi.image_url) as image_urls
      FROM gem g
      LEFT JOIN seller s ON g.seller_id = s.seller_id
      LEFT JOIN user u ON s.seller_id = u.user_id
      LEFT JOIN gem_images gi ON g.gem_id = gi.gem_id
      WHERE g.status = 'Available'
    `;
    
    const params: any[] = [];

    // Filter by gem type
    if (filters?.type) {
      query += ' AND g.gem_type = ?';
      params.push(filters.type);
    }

    // Filter by price range
    if (filters?.minPrice !== undefined) {
      query += ' AND g.price >= ?';
      params.push(filters.minPrice);
    }
    if (filters?.maxPrice !== undefined) {
      query += ' AND g.price <= ?';
      params.push(filters.maxPrice);
    }

    // Filter by color
    if (filters?.color) {
      query += ' AND g.color = ?';
      params.push(filters.color);
    }

    // Filter by origin
    if (filters?.origin) {
      query += ' AND g.origin = ?';
      params.push(filters.origin);
    }

    // Filter by clarity
    if (filters?.clarity) {
      query += ' AND g.clarity = ?';
      params.push(filters.clarity);
    }

    // Search by gem name or description
    if (filters?.search) {
      query += ' AND (g.gem_name LIKE ? OR g.description LIKE ? OR g.origin LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Filter by seller verification status
    if (filters?.sellerVerification) {
      query += ' AND s.verification_status = ?';
      params.push(filters.sellerVerification);
    }

    query += ' GROUP BY g.gem_id ORDER BY g.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query<any[]>(query, params);
    
    // Process rows to format images
    return rows.map((row: any) => ({
      ...row,
      images: row.image_urls 
        ? row.image_urls.split(',').map((url: string, idx: number) => ({
            image_id: idx,
            image_url: url
          }))
        : []
    }));
  },

  // Get single gem by ID with images and seller details
  async getGemById(gemId: number): Promise<GemWithImages | null> {
    const query = `
      SELECT 
        g.gem_id,
        g.seller_id,
        g.gem_name,
        g.gem_type,
        g.price,
        g.color,
        g.cut,
        g.carat,
        g.clarity,
        g.origin,
        g.description,
        g.ngia_certificate_no,
        g.ngia_certificate_url,
        g.status,
        g.updated_date,
        g.created_at,
        u.full_name as seller_name,
        u.email as seller_email,
        u.mobile as seller_mobile,
        s.verification_status,
        s.business_name,
        GROUP_CONCAT(gi.image_url) as image_urls
      FROM gem g
      LEFT JOIN seller s ON g.seller_id = s.seller_id
      LEFT JOIN user u ON s.seller_id = u.user_id
      LEFT JOIN gem_images gi ON g.gem_id = gi.gem_id
      WHERE g.gem_id = ? AND g.status = 'Available'
      GROUP BY g.gem_id
    `;

    const [rows] = await pool.query<any[]>(query, [gemId]);

    if (rows.length === 0) return null;

    const gem = rows[0];
    return {
      ...gem,
      images: gem.image_urls
        ? gem.image_urls.split(',').map((url: string, idx: number) => ({
            image_id: idx,
            image_url: url
          }))
        : []
    };
  },

  // Get gems by specific types
  async getGemsByTypes(types: string[]): Promise<GemRow[]> {
    const placeholders = types.map(() => '?').join(',');
    const query = `
      SELECT * FROM gem 
      WHERE gem_type IN (${placeholders}) 
      AND status = 'Available'
      ORDER BY created_at DESC
    `;
    const [rows] = await pool.query<GemRow[]>(query, types);
    return rows;
  },

  // Search gems by name or description
  async searchGems(
    query: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<GemRow[]> {
    const searchTerm = `%${query}%`;
    const sqlQuery = `
      SELECT * FROM gem 
      WHERE (gem_name LIKE ? OR description LIKE ? OR origin LIKE ?) 
      AND status = 'Available'
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query<GemRow[]>(
      sqlQuery,
      [searchTerm, searchTerm, searchTerm, limit, offset]
    );
    return rows;
  },

  // Get gems by seller ID
  async getGemsBySeller(
    sellerId: number,
    limit: number = 10,
    offset: number = 0
  ): Promise<GemRow[]> {
    const query = `
      SELECT * FROM gem 
      WHERE seller_id = ? 
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query<GemRow[]>(query, [sellerId, limit, offset]);
    return rows;
  },

  // Get gem count with filters (for pagination)
  async getGemCount(filters?: FilterParams): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM gem g LEFT JOIN seller s ON g.seller_id = s.seller_id WHERE g.status = "Available"';
    const params: any[] = [];

    if (filters?.type) {
      query += ' AND g.gem_type = ?';
      params.push(filters.type);
    }
    if (filters?.minPrice !== undefined) {
      query += ' AND g.price >= ?';
      params.push(filters.minPrice);
    }
    if (filters?.maxPrice !== undefined) {
      query += ' AND g.price <= ?';
      params.push(filters.maxPrice);
    }
    if (filters?.color) {
      query += ' AND g.color = ?';
      params.push(filters.color);
    }
    if (filters?.origin) {
      query += ' AND g.origin = ?';
      params.push(filters.origin);
    }
    if (filters?.clarity) {
      query += ' AND g.clarity = ?';
      params.push(filters.clarity);
    }
    if (filters?.search) {
      query += ' AND (g.gem_name LIKE ? OR g.description LIKE ? OR g.origin LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    if (filters?.sellerVerification) {
      query += ' AND s.verification_status = ?';
      params.push(filters.sellerVerification);
    }

    const [rows] = await pool.query<any[]>(query, params);
    return rows[0].count;
  },

  // Get available filters for marketplace UI
  async getFilterOptions(): Promise<any> {
    const [types] = await pool.query<RowDataPacket[]>('SELECT DISTINCT gem_type FROM gem WHERE status = "Available"');
    const [origins] = await pool.query<RowDataPacket[]>('SELECT DISTINCT origin FROM gem WHERE status = "Available"');
    const [clarities] = await pool.query<RowDataPacket[]>('SELECT DISTINCT clarity FROM gem WHERE status = "Available"');
    const [priceRange] = await pool.query<RowDataPacket[]>('SELECT MIN(price) as minPrice, MAX(price) as maxPrice FROM gem WHERE status = "Available"');

    return {
      types: types.map((t: any) => t.gem_type).filter(Boolean),
      origins: origins.map((o: any) => o.origin).filter(Boolean),
      clarities: clarities.map((c: any) => c.clarity).filter(Boolean),
      priceRange: priceRange[0]
    };
  }
};