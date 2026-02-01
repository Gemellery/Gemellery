import { z } from 'zod';

// Main form validation schema
export const gemFormSchema = z.object({
    gemType: z.string().min(1, 'Gem type is required'),
    gemTypeOther: z.string().optional(),
    gemCut: z.string().min(1, 'Gem cut is required'),
    gemSizeMode: z.enum(['simple', 'advanced']),
    gemSizeSimple: z.string().optional(),
    gemSizeLengthMm: z.number().positive().optional(),
    gemSizeWidthMm: z.number().positive().optional(),
    gemSizeHeightMm: z.number().positive().optional(),
    gemSizeCarat: z.number().positive().optional(),
    gemColor: z.string().min(1, 'Gem color is required'),
    gemTransparency: z.string().min(1, 'Transparency is required'),
    gemImageUrl: z.string().optional(),
    designPrompt: z.string()
        .min(10, 'Design description must be at least 10 characters')
        .max(1000, 'Design description must be under 1000 characters'),
    materials: z.object({
        metals: z.array(z.string()),
        finish: z.string().optional(),
    }),
    numImages: z.number().min(2).max(4),
}).refine(
    (data) => {
        // If gem type is 'Other', require gemTypeOther
        if (data.gemType === 'Other') {
            return !!data.gemTypeOther && data.gemTypeOther.length > 0;
        }
        return true;
    },
    {
        message: 'Please specify the gem type',
        path: ['gemTypeOther'],
    }
).refine(
    (data) => {
        // If simple mode, require gemSizeSimple
        if (data.gemSizeMode === 'simple') {
            return !!data.gemSizeSimple;
        }
        return true;
    },
    {
        message: 'Please select a size',
        path: ['gemSizeSimple'],
    }
).refine(
    (data) => {
        // If advanced mode, require all dimensions
        if (data.gemSizeMode === 'advanced') {
            return !!data.gemSizeLengthMm && !!data.gemSizeWidthMm && !!data.gemSizeHeightMm;
        }
        return true;
    },
    {
        message: 'Please enter all dimensions',
        path: ['gemSizeLengthMm'],
    }
);

export type GemFormValues = z.infer<typeof gemFormSchema>;

// Type for form default values (used by react-hook-form)
export interface GemFormDefaults {
    gemType: string;
    gemTypeOther?: string;
    gemCut: string;
    gemSizeMode: 'simple' | 'advanced';
    gemSizeSimple?: string;
    gemSizeLengthMm?: number;
    gemSizeWidthMm?: number;
    gemSizeHeightMm?: number;
    gemSizeCarat?: number;
    gemColor: string;
    gemTransparency: string;
    gemImageUrl?: string;
    designPrompt: string;
    materials: {
        metals: string[];
        finish?: string;
    };
    numImages: number;
}

