// Gem types available for selection
export const GEM_TYPES = [
    'Diamond',
    'Sapphire',
    'Ruby',
    'Emerald',
    'Topaz',
    'Amethyst',
    'Aquamarine',
    'Opal',
    'Garnet',
    'Peridot',
    'Tanzanite',
    'Tourmaline',
    'Citrine',
    'Moonstone',
    'Jade',
    'Other',
] as const;

// Gem cut styles with icons and descriptions
export const GEM_CUTS = [
    { value: 'round-brilliant', label: 'Round Brilliant', description: 'Classic round shape' },
    { value: 'oval', label: 'Oval', description: 'Elongated round' },
    { value: 'cushion', label: 'Cushion', description: 'Square with rounded corners' },
    { value: 'pear', label: 'Pear', description: 'Teardrop shape' },
    { value: 'emerald-cut', label: 'Emerald Cut', description: 'Rectangular step cut' },
    { value: 'marquise', label: 'Marquise', description: 'Football shape' },
    { value: 'asscher', label: 'Asscher', description: 'Square step cut' },
    { value: 'princess', label: 'Princess', description: 'Square brilliant' },
    { value: 'radiant', label: 'Radiant', description: 'Square with trimmed corners' },
    { value: 'heart', label: 'Heart', description: 'Heart shape' },
] as const;

// Simple size options
export const GEM_SIZES = [
    { value: 'small', label: 'Small', description: 'Under 5mm - Perfect for delicate designs' },
    { value: 'medium', label: 'Medium', description: '5-8mm - Most popular size' },
    { value: 'large', label: 'Large', description: 'Over 8mm - Statement piece' },
] as const;

// Color options
export const GEM_COLORS = [
    { value: 'colorless', label: 'Colorless/White', hex: '#FFFFFF' },
    { value: 'blue-light', label: 'Light Blue', hex: '#87CEEB' },
    { value: 'blue-medium', label: 'Medium Blue', hex: '#4169E1' },
    { value: 'blue-dark', label: 'Dark Blue', hex: '#00008B' },
    { value: 'red-light', label: 'Light Red', hex: '#FFB6C1' },
    { value: 'red-medium', label: 'Medium Red', hex: '#DC143C' },
    { value: 'red-dark', label: 'Dark Red', hex: '#8B0000' },
    { value: 'green-light', label: 'Light Green', hex: '#90EE90' },
    { value: 'green-medium', label: 'Medium Green', hex: '#228B22' },
    { value: 'green-dark', label: 'Dark Green', hex: '#006400' },
    { value: 'yellow-golden', label: 'Yellow/Golden', hex: '#FFD700' },
    { value: 'pink-rose', label: 'Pink/Rose', hex: '#FFB6D9' },
    { value: 'purple-violet', label: 'Purple/Violet', hex: '#9370DB' },
    { value: 'orange', label: 'Orange', hex: '#FF8C00' },
    { value: 'black', label: 'Black', hex: '#000000' },
    { value: 'multi-color', label: 'Multi-color', hex: 'linear-gradient(90deg, #FF0000, #00FF00, #0000FF)' },
] as const;

// Transparency options
export const GEM_TRANSPARENCY = [
    { value: 'transparent', label: 'Transparent', description: 'Clear, see-through' },
    { value: 'semi-transparent', label: 'Semi-transparent', description: 'Slightly cloudy' },
    { value: 'opaque', label: 'Opaque', description: 'Solid, no transparency' },
] as const;

// Metal types
export const METAL_TYPES = [
    { value: 'yellow-gold-10k', label: 'Yellow Gold (10K)' },
    { value: 'yellow-gold-14k', label: 'Yellow Gold (14K)' },
    { value: 'yellow-gold-18k', label: 'Yellow Gold (18K)' },
    { value: 'white-gold', label: 'White Gold' },
    { value: 'rose-gold', label: 'Rose Gold' },
    { value: 'platinum', label: 'Platinum' },
    { value: 'sterling-silver', label: 'Sterling Silver' },
    { value: 'fine-silver', label: 'Fine Silver' },
] as const;

// Metal finishes
export const METAL_FINISHES = [
    { value: 'polished', label: 'Polished', description: 'Shiny finish' },
    { value: 'matte', label: 'Matte', description: 'Brushed finish' },
    { value: 'hammered', label: 'Hammered', description: 'Textured finish' },
] as const;

// Design prompt examples
export const PROMPT_EXAMPLES = [
    'Art deco engagement ring with halo setting in platinum',
    'Vintage-style pendant necklace with filigree details',
    'Modern minimalist solitaire ring with thin band',
    'Three-stone ring with side diamonds in yellow gold',
] as const;
