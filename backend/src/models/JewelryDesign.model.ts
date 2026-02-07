import pool from "../database";

// ============================================
// TypeScript Interfaces
// ============================================

export interface GeneratedImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  generatedAt: string;
}

export interface Refinement {
  id: string;
  prompt: string;
  baseImageUrl: string;
  imageUrl: string;
  thumbnailUrl?: string;
  strength?: number;
  refinedAt: string;
}

export interface Materials {
  metals: string[];
  finish?: string;
}

export interface JewelryDesignAttributes {
  id: number;
  user_id: number;
  gem_type: string;
  gem_cut: string;
  gem_size_mode: "simple" | "advanced";
  gem_size_simple?: string;
  gem_size_length_mm?: number;
  gem_size_width_mm?: number;
  gem_size_height_mm?: number;
  gem_size_carat?: number;
  gem_color: string;
  gem_transparency: string;
  gem_image_url?: string;
  design_prompt: string;
  materials: Materials;
  generated_images: GeneratedImage[];
  selected_image_url?: string;
  refinements?: Refinement[];
  created_at?: Date;
  updated_at?: Date;
}

export interface JewelryDesignInput {
  user_id: number;
  gem_type: string;
  gem_cut: string;
  gem_size_mode: "simple" | "advanced";
  gem_size_simple?: string;
  gem_size_length_mm?: number;
  gem_size_width_mm?: number;
  gem_size_height_mm?: number;
  gem_size_carat?: number;
  gem_color: string;
  gem_transparency: string;
  gem_image_url?: string;
  design_prompt: string;
  materials: Materials;
  generated_images: GeneratedImage[];
}

// ============================================
// Database Helper Functions
// ============================================

/**
 * Create a new jewelry design
 * @returns The inserted design ID
 */
export const createDesign = async (
  data: JewelryDesignInput
): Promise<number> => {
  const [result]: any = await pool.query(
    `INSERT INTO jewelry_designs 
      (user_id, gem_type, gem_cut, gem_size_mode, gem_size_simple, 
       gem_size_length_mm, gem_size_width_mm, gem_size_height_mm, gem_size_carat,
       gem_color, gem_transparency, gem_image_url, design_prompt, 
       materials, generated_images)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.user_id,
      data.gem_type,
      data.gem_cut,
      data.gem_size_mode,
      data.gem_size_simple || null,
      data.gem_size_length_mm || null,
      data.gem_size_width_mm || null,
      data.gem_size_height_mm || null,
      data.gem_size_carat || null,
      data.gem_color,
      data.gem_transparency,
      data.gem_image_url || null,
      data.design_prompt,
      JSON.stringify(data.materials),
      JSON.stringify(data.generated_images),
    ]
  );

  return result.insertId;
};

/**
 * Get a design by ID (only if it belongs to the user)
 */
export const getDesignById = async (
  id: number,
  userId: number
): Promise<JewelryDesignAttributes | null> => {
  const [rows]: any = await pool.query(
    `SELECT * FROM jewelry_designs WHERE id = ? AND user_id = ?`,
    [id, userId]
  );

  if (rows.length === 0) {
    return null;
  }

  return parseDesignRow(rows[0]);
};

/**
 * Get all designs for a user
 */
export const getUserDesigns = async (
  userId: number
): Promise<JewelryDesignAttributes[]> => {
  const [rows]: any = await pool.query(
    `SELECT * FROM jewelry_designs WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );

  return rows.map(parseDesignRow);
};

/**
 * Update a design
 */
export const updateDesign = async (
  id: number,
  userId: number,
  data: Partial<{
    selected_image_url: string;
    refinements: Refinement[];
    generated_images: GeneratedImage[];
  }>
): Promise<boolean> => {
  const updates: string[] = [];
  const values: any[] = [];

  if (data.selected_image_url !== undefined) {
    updates.push("selected_image_url = ?");
    values.push(data.selected_image_url);
  }

  if (data.refinements !== undefined) {
    updates.push("refinements = ?");
    values.push(JSON.stringify(data.refinements));
  }

  if (data.generated_images !== undefined) {
    updates.push("generated_images = ?");
    values.push(JSON.stringify(data.generated_images));
  }

  if (updates.length === 0) {
    return false;
  }

  values.push(id, userId);

  const [result]: any = await pool.query(
    `UPDATE jewelry_designs SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
    values
  );

  return result.affectedRows > 0;
};

/**
 * Delete a design
 */
export const deleteDesign = async (
  id: number,
  userId: number
): Promise<boolean> => {
  const [result]: any = await pool.query(
    `DELETE FROM jewelry_designs WHERE id = ? AND user_id = ?`,
    [id, userId]
  );

  return result.affectedRows > 0;
};

// ============================================
// Helper Functions
// ============================================

/**
 * Parse a database row into a JewelryDesignAttributes object
 */
const parseDesignRow = (row: any): JewelryDesignAttributes => {
  return {
    id: row.id,
    user_id: row.user_id,
    gem_type: row.gem_type,
    gem_cut: row.gem_cut,
    gem_size_mode: row.gem_size_mode,
    gem_size_simple: row.gem_size_simple,
    gem_size_length_mm: row.gem_size_length_mm
      ? parseFloat(row.gem_size_length_mm)
      : undefined,
    gem_size_width_mm: row.gem_size_width_mm
      ? parseFloat(row.gem_size_width_mm)
      : undefined,
    gem_size_height_mm: row.gem_size_height_mm
      ? parseFloat(row.gem_size_height_mm)
      : undefined,
    gem_size_carat: row.gem_size_carat
      ? parseFloat(row.gem_size_carat)
      : undefined,
    gem_color: row.gem_color,
    gem_transparency: row.gem_transparency,
    gem_image_url: row.gem_image_url,
    design_prompt: row.design_prompt,
    materials:
      typeof row.materials === "string"
        ? JSON.parse(row.materials)
        : row.materials,
    generated_images:
      typeof row.generated_images === "string"
        ? JSON.parse(row.generated_images)
        : row.generated_images || [],
    selected_image_url: row.selected_image_url,
    refinements:
      typeof row.refinements === "string"
        ? JSON.parse(row.refinements)
        : row.refinements || [],
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};
