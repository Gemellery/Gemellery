import pool from "../database";

//Define Gem data
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

export const gemModel = {
  // Fetch gems with filters
  getGems: async (params: any) => {
    // Destructure all filter parameters
    const { 
      limit, 
      offset, 
      type,
      priceMin, 
      priceMax, 
      origin, 
      clarity, 
      color,
      search, 
      hasCertificate,  
      sellerVerified   
    } = params;
    
    try {
      let query = `
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
          g.description,
          g.ngja_certificate_no,
          g.ngja_certificate_url,
          gi.image_url,
          u.full_name as seller_name,
          g.verification_status,
          g.created_at,
          CASE 
            WHEN g.ngja_certificate_url IS NOT NULL THEN 1 
            ELSE 0 
          END as has_certificate
        FROM gem g
        LEFT JOIN gem_images gi ON g.gem_id = gi.gem_id
        LEFT JOIN user u ON g.seller_id = u.user_id
        WHERE g.status = 'Available'
      `;
      
      const queryParams: any[] = [];
      
      //Gem Type
      if (type) {
        query += ` AND g.gem_type = ?`;
        queryParams.push(type);
      }
      
      //Price Range
      if (priceMin !== undefined) {
        query += ` AND g.price >= ?`;
        queryParams.push(priceMin);
      }
      if (priceMax !== undefined) {
        query += ` AND g.price <= ?`;
        queryParams.push(priceMax);
      }
      
      //Origin (Country)
      if (origin) {
        query += ` AND g.origin = ?`;
        queryParams.push(origin);
      }
      
      //Clarity Grade
      if (clarity) {
        query += ` AND g.clarity = ?`;
        queryParams.push(clarity);
      }
      
      //Color Grade
      if (color) {
        query += ` AND g.color = ?`;
        queryParams.push(color);
      }
      
      //Certificate Existence
      if (hasCertificate === 'true') {
        query += ` AND g.ngja_certificate_url IS NOT NULL`;
      } else if (hasCertificate === 'false') {
        query += ` AND g.ngja_certificate_url IS NULL`;
      }
      
      if (sellerVerified === 'true') {
        query += ` AND s.verification_status = 'verified'`;
      }
      
      //Search Term (across name, gem type, origin)
      if (search) {
        query += ` AND (g.gem_name LIKE ? OR g.gem_type LIKE ? OR g.origin LIKE ?)`;
        const searchTerm = `%${search}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
      }
      
      // Group and Paginate
      query += ` GROUP BY g.gem_id ORDER BY g.created_at DESC LIMIT ? OFFSET ?`;
      queryParams.push(limit, offset);
      
      const [gems] = await pool.query(query, queryParams);
      return gems;
      
    } catch (error) {
      console.error("Error in getGems:", error);
      throw error;
    }
  },
  
  // Count total gems matching filters
  getGemCount: async (params: any) => {
    const { type, priceMin, priceMax, origin, clarity, search, treatment, sellerVerification } = params;
    
    try {
      let query = `
        SELECT COUNT(*) as total
        FROM gem g
        WHERE g.status = 'Available'
      `;
      
      const queryParams: any[] = [];
      
      if (type) {
        query += ` AND g.gem_type = ?`;
        queryParams.push(type);
      }
      
      if (priceMin !== undefined) {
        query += ` AND g.price >= ?`;
        queryParams.push(priceMin);
      }
      
      if (priceMax !== undefined) {
        query += ` AND g.price <= ?`;
        queryParams.push(priceMax);
      }
      
      if (origin) {
        query += ` AND g.origin = ?`;
        queryParams.push(origin);
      }
      
      if (clarity) {
        query += ` AND g.clarity = ?`;
        queryParams.push(clarity);
      }
      
      if (search) {
        query += ` AND g.gem_name LIKE ?`;
        queryParams.push(`%${search}%`);
      }
      
      if (treatment) {
        query += ` AND g.gem_type LIKE ?`;
        queryParams.push(`%${treatment}%`);
      }
      
      if (sellerVerification) {
        query += ` AND s.verification_status = ?`;
        queryParams.push(sellerVerification);
      }
      
      const [result]: any = await pool.query(query, queryParams);
      return result[0].total;
      
    } catch (error) {
      console.error("Error in getGemCount:", error);
      throw error;
    }
  },
  
  // Get gem by ID
  getGemById: async (gemId: string) => {
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
          g.description,
          g.ngja_certificate_no,
          g.ngja_certificate_url,
          g.created_at
        FROM gem g
        WHERE g.gem_id = ? AND g.status = 'Available'
      `;
      
      const [gems]: any = await pool.query(query, [gemId]);
      return gems[0] || null;
      
    } catch (error) {
      console.error("Error in getGemById:", error);
      throw error;
    }
  }
};