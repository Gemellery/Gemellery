import pool from "../database";

// ============================================================
// Type Definitions
// ============================================================

export interface GemListItem {
  gem_id: number;
  gem_name: string;
  gem_type: string;
  price: number;
  carat: number;
  color: string;
  cut: string;
  clarity: string;
  origin: string;
  mining_region: string;
  isCertified: boolean;
  certificateNumber: string | null;
  certificateUrl: string | null;
  verificationStatus: "pending" | "verified" | "rejected" | "available";
  status: "available" | "unavailable";
  seller_id: number;
  seller_name: string;
  image_url: string | null;
}

export interface Gem extends GemListItem {
  description: string;
  images: string[];
  created_at: string;
}

/** Parameters accepted by getGems and getGemCount */
export interface GemQueryParams {
  page?: number;
  limit?: number;
  gemType?: string;
  gemName?: string;
  cut?: string;
  clarity?: string;
  origin?: string;
  miningRegion?: string;
  color?: string;
  specialColors?: string;
  priceRanges?: string;
  priceMin?: number;
  priceMax?: number;
  caratMin?: number;
  caratMax?: number;
  isCertified?: string;
  search?: string;
}

/** Parameters for creating a new gem */
export interface CreateGemParams {
  seller_id: number;
  gem_name: string;
  gem_type?: string;
  carat?: number;
  cut?: string;
  clarity?: string;
  color?: string;
  origin?: string;
  mining_region?: string;
  price?: number;
  description?: string;
  ngja_certificate_no: string;
  ngja_certificate_url?: string | null;
  images?: string[];
}

// ============================================================
// Constants
// ============================================================

const BASIC_COLOR_KEYWORDS = [
  'Blue', 'Red', 'Green', 'Yellow', 'Pink',
  'Purple', 'Orange', 'Brown', 'Black', 'White', 'Colorless'
];

// ============================================================
// Private Helpers — shared between getGems and getGemCount
// ============================================================

/** Uses Comma to seperate */
function addInClause(
  paramValue: string | undefined,
  column: string,
  whereConditions: string[],
  queryParams: any[]
): void {
  if (!paramValue) return;

  const values = paramValue.split(',').map(v => v.trim()).filter(v => v);

  if (values.length === 1) {
    whereConditions.push(`${column} = ?`);
    queryParams.push(values[0]);
  } else if (values.length > 1) {
    const placeholders = values.map(() => '?').join(', ');
    whereConditions.push(`${column} IN (${placeholders})`);
    queryParams.push(...values);
  }
}

/**Color Filter Condition*/
function addColorFilter(
  color: string | undefined,
  specialColors: string | undefined,
  whereConditions: string[],
  queryParams: any[]
): void {
  const colorParts: string[] = [];

  if (color) {
    const colors = color.split(',').map(c => c.trim()).filter(c => c);
    if (colors.length > 0) {
      const likeConditions = colors.map(() => `g.color LIKE ?`).join(' OR ');
      colorParts.push(`(${likeConditions})`);
      colors.forEach(c => queryParams.push(`%${c}%`));
    }
  }

  if (specialColors === 'true') {
    const excludeConditions = BASIC_COLOR_KEYWORDS.map(() => `g.color NOT LIKE ?`).join(' AND ');
    colorParts.push(`(${excludeConditions})`);
    BASIC_COLOR_KEYWORDS.forEach(c => queryParams.push(`%${c}%`));
  }

  if (colorParts.length > 0) {
    whereConditions.push(`(${colorParts.join(' OR ')})`);
  }
}

/** Price filter */
function addPriceFilter(
  priceRanges: string | undefined,
  priceMin: number | undefined,
  priceMax: number | undefined,
  whereConditions: string[],
  queryParams: any[]
): void {
  if (priceRanges) {
    const ranges = priceRanges.split(',').map(r => r.trim()).filter(r => r);
    if (ranges.length > 0) {
      const priceConditions: string[] = [];
      ranges.forEach(range => {
        const [min, max] = range.split('-');
        if (max === 'Infinity') {
          priceConditions.push('g.price >= ?');
          queryParams.push(parseFloat(min));
        } else {
          priceConditions.push('(g.price >= ? AND g.price <= ?)');
          queryParams.push(parseFloat(min), parseFloat(max));
        }
      });
      whereConditions.push(`(${priceConditions.join(' OR ')})`);
    }
  } else {
    // Legacy single price min/max (backward compatibility)
    if (priceMin !== undefined && !isNaN(priceMin)) {
      whereConditions.push("g.price >= ?");
      queryParams.push(priceMin);
    }
    if (priceMax !== undefined && !isNaN(priceMax)) {
      whereConditions.push("g.price <= ?");
      queryParams.push(priceMax);
    }
  }
}

/** Where cinditions*/
function buildWhereClause(params: GemQueryParams): {
  whereClause: string;
  queryParams: any[];
} {
  const whereConditions: string[] = [];
  const queryParams: any[] = [];

  // Only show available gems
  whereConditions.push("g.status = ?");
  queryParams.push("Available");

  // Exact / IN filters
  addInClause(params.gemType, 'g.gem_type', whereConditions, queryParams);
  addInClause(params.gemName, 'g.gem_name', whereConditions, queryParams);
  addInClause(params.cut, 'g.cut', whereConditions, queryParams);
  addInClause(params.clarity, 'g.clarity', whereConditions, queryParams);
  addInClause(params.origin, 'g.origin', whereConditions, queryParams);
  addInClause(params.miningRegion, 'g.mining_region', whereConditions, queryParams);

  // Color filters
  addColorFilter(params.color, params.specialColors, whereConditions, queryParams);

  // Price filters
  addPriceFilter(params.priceRanges, params.priceMin, params.priceMax, whereConditions, queryParams);

  // Certification filter
  if (params.isCertified === "true") {
    whereConditions.push("g.ngja_certificate_url IS NOT NULL");
  } else if (params.isCertified === "false") {
    whereConditions.push("g.ngja_certificate_url IS NULL");
  }

  // Search filter
  if (params.search) {
    whereConditions.push("(g.gem_name LIKE ? OR g.gem_type LIKE ? OR g.origin LIKE ?)");
    queryParams.push(`%${params.search}%`, `%${params.search}%`, `%${params.search}%`);
  }

  // Carat range
  if (params.caratMin !== undefined) {
    whereConditions.push("g.carat >= ?");
    queryParams.push(params.caratMin);
  }
  if (params.caratMax !== undefined) {
    whereConditions.push("g.carat <= ?");
    queryParams.push(params.caratMax);
  }

  return {
    whereClause: whereConditions.join(" AND "),
    queryParams,
  };
}

// ============================================================
// Public Model — the only thing the controller should call
// ============================================================

export const gemModel = {

  /** List of gems with pagination*/
  getGems: async (params: GemQueryParams): Promise<any[]> => {
    try {
      const page = params.page || 1;
      const limit = params.limit || 12;
      const offset = (page - 1) * limit;

      const { whereClause, queryParams } = buildWhereClause(params);

      const query = `
        SELECT 
          g.gem_id as id,
          g.gem_name as name,
          g.gem_type as type,
          g.price,
          g.carat as weight,
          g.cut,
          g.clarity,
          g.color,
          g.origin,
          g.mining_region as miningRegion,
          g.description,
          g.ngja_certificate_no as certification,
          g.ngja_certificate_url as certificateUrl,
          JSON_ARRAYAGG(gi.image_url) as images,
          g.seller_id,
          u.full_name as seller_name,
          g.verification_status as verificationStatus,
          CASE 
            WHEN LOWER(g.verification_status) = 'approved' THEN 1
            ELSE 0
          END as verified,
          g.status,
          g.created_at as createdAt
        FROM gem g
        LEFT JOIN gem_images gi ON g.gem_id = gi.gem_id
        LEFT JOIN user u ON g.seller_id = u.user_id
        WHERE ${whereClause}
        GROUP BY g.gem_id, g.gem_name, g.gem_type, g.price, g.carat, g.cut,
                 g.clarity, g.color, g.origin, g.mining_region, g.description,
                 g.ngja_certificate_no, g.ngja_certificate_url, g.seller_id,
                 u.full_name, g.verification_status, g.status, g.created_at
        ORDER BY g.created_at DESC
        LIMIT ? OFFSET ?
      `;

      queryParams.push(limit, offset);

      const [gems] = await pool.query(query, queryParams) as any;
      return gems;

    } catch (error) {
      console.error("Error in gemModel.getGems:", error);
      throw error;
    }
  },

  /** Total gems for the given filter */
  getGemCount: async (params: GemQueryParams): Promise<number> => {
    try {
      const { whereClause, queryParams } = buildWhereClause(params);

      const query = `
        SELECT COUNT(DISTINCT g.gem_id) as total
        FROM gem g
        LEFT JOIN gem_images gi ON g.gem_id = gi.gem_id
        LEFT JOIN user u ON g.seller_id = u.user_id
        WHERE ${whereClause}
      `;

      const [result]: any = await pool.query(query, queryParams);
      return result[0]?.total || 0;

    } catch (error) {
      console.error("Error in gemModel.getGemCount:", error);
      throw error;
    }
  },

  /** Gem by ID */
  getGemById: async (gemId: string): Promise<any | null> => {
    try {
      const query = `
        SELECT 
          g.gem_id,
          g.gem_name,
          g.gem_type,
          g.price,
          g.carat,
          g.cut,
          g.clarity,
          g.color,
          g.origin,
          g.mining_region,
          g.description,
          g.ngja_certificate_no,
          g.ngja_certificate_url,
          g.verification_status,
          CASE 
            WHEN LOWER(g.verification_status) = 'approved' THEN 1
            ELSE 0
          END as verified,
          g.status,
          g.created_at,
          u.full_name as seller_name,
          g.seller_id
        FROM gem g
        LEFT JOIN user u ON g.seller_id = u.user_id
        WHERE g.gem_id = ? AND g.status = 'Available'
      `;

      const [gems]: any = await pool.query(query, [gemId]);

      if (!gems[0]) return null;

      // Fetch all images for this gem
      const [images]: any = await pool.query(
        `SELECT image_url FROM gem_images WHERE gem_id = ?`,
        [gemId]
      );

      return {
        ...gems[0],
        images: images.map((img: any) => img.image_url),
      };

    } catch (error) {
      console.error("Error in gemModel.getGemById:", error);
      throw error;
    }
  },

  /** Certification */
  certificateExists: async (certificateNo: string, connection?: any): Promise<boolean> => {
    try {
      const db = connection || pool;
      const [existing]: any = await db.query(
        "SELECT gem_id FROM gem WHERE ngja_certificate_no = ? LIMIT 1",
        [certificateNo]
      );
      return existing.length > 0;
    } catch (error) {
      console.error("Error in gemModel.certificateExists:", error);
      throw error;
    }
  },

  /** New gem creation */
  createGem: async (params: CreateGemParams): Promise<number> => {

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const exists = await gemModel.certificateExists(
        params.ngja_certificate_no,
        conn
      );

      if (exists) {
        await conn.rollback();
        throw {
          code: "DUPLICATE_CERTIFICATE",
          message: "This NGJA certificate number is already registered.",
        };
      }

      const [result]: any = await conn.query(
        `INSERT INTO gem
      (seller_id, gem_name, gem_type, carat, cut, clarity, color, origin,
       mining_region, price, description,
       ngja_certificate_no, ngja_certificate_url,
       updated_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), 'Available')`,
        [
          params.seller_id,
          params.gem_name,
          params.gem_type || null,
          params.carat || null,
          params.cut || null,
          params.clarity || null,
          params.color || null,
          params.origin || null,
          params.mining_region || null,
          params.price || null,
          params.description || null,
          params.ngja_certificate_no,
          params.ngja_certificate_url || null,
        ]
      );

      const gem_id = result.insertId;

      if (params.images && params.images.length > 0) {
        const values = params.images.map((img) => [gem_id, img]);

        await conn.query(
          `INSERT INTO gem_images (gem_id, image_url) VALUES ?`,
          [values]
        );
      }

      await conn.commit();
      return gem_id;

    } catch (err: any) {

      await conn.rollback();

      if (err.code === "ER_DUP_ENTRY") {
        throw {
          code: "DUPLICATE_CERTIFICATE",
          message: "This NGJA certificate number already exists.",
        };
      }

      throw err;

    } finally {
      conn.release();
    }
  }
};