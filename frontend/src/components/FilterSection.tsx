import React, { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import type { GemFilters } from '@/lib/gems/types'

// ──────────────────────────────────────────────
// Props — what the parent (Marketplace) passes in
// ──────────────────────────────────────────────
interface FilterSectionProps {
  onFilterChange: (filters: GemFilters) => void;
}

// ──────────────────────────────────────────────
// Internal filter state shape
// ──────────────────────────────────────────────
interface FiltersType {
  gemName: string[];           
  caratWeight: number[];       
  priceRange: string[];        
  color: string[];            
  cutShape: string[];          
  clarity: string[];           
  origin: string[];            
  treatment: string[];         
  certification: string[];     
}

interface ExpandedSectionsType {
  gemName: boolean;
  caratWeight: boolean;
  priceRange: boolean;
  color: boolean;
  cutShape: boolean;
  clarity: boolean;
  origin: boolean;
  treatment: boolean;
  certification: boolean;
}

interface FilterCheckboxProps {
  label: string;
  section: keyof FiltersType;
  value: string;
}

interface FilterSectionComponentProps {
  title: string;
  sectionKey: keyof ExpandedSectionsType;
  children: React.ReactNode;
}

interface CutShapeOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// ──────────────────────────────────────────────
// Price buckets — maps UI labels to min-max ranges
// ──────────────────────────────────────────────
const PRICE_BUCKETS: Record<string, { min: number; max: number | typeof Infinity }> = {
  under100k:    { min: 0,      max: 100000 },
  '100kto250k': { min: 100000, max: 250000 },
  '250kto500k': { min: 250000, max: 500000 },
  above500k:    { min: 500000, max: Infinity },
};

// ──────────────────────────────────────────────
// Convert internal filter state → GemFilters for the API
// ──────────────────────────────────────────────
function convertToGemFilters(filters: FiltersType): GemFilters {
  const gemFilters: GemFilters = {};

  // Gem name/type
  if (filters.gemName.length > 0) {
    gemFilters.gemName = filters.gemName.join(',');
  }

  // Carat weight range
  if (filters.caratWeight[0] > 0.5) {
    gemFilters.caratMin = filters.caratWeight[0];
  }
  if (filters.caratWeight[1] < 50) {
    gemFilters.caratMax = filters.caratWeight[1];
  }

  // Price range
  if (filters.priceRange.length > 0) {
    const ranges = filters.priceRange.map(key => {
      const bucket = PRICE_BUCKETS[key];
      if (!bucket) return null;
      return `${bucket.min}-${bucket.max === Infinity ? 'Infinity' : bucket.max}`;
    }).filter(Boolean);

    if (ranges.length > 0) {
      gemFilters.priceRanges = ranges.join(',');
    }
  }

  // Color
  if (filters.color.length > 0) {
    gemFilters.color = filters.color.join(',');
  }

  // Cut/Shape 
  if (filters.cutShape.length > 0) {
    gemFilters.cut = filters.cutShape.join(',');
  }

  // Clarity
  if (filters.clarity.length > 0) {
    gemFilters.clarity = filters.clarity.join(',');
  }

  // Origin 
  if (filters.origin.length > 0) {
    gemFilters.origin = filters.origin.join(',');
  }

  // Treatment 
  if (filters.treatment.length > 0) {
    gemFilters.gemType = filters.treatment.join(',');
  }

  // ── Certification ──
  if (filters.certification.length > 0) {
    if (filters.certification.includes('certified') && !filters.certification.includes('uncertified')) {
      gemFilters.isCertified = 'true';
    } else if (filters.certification.includes('uncertified') && !filters.certification.includes('certified')) {
      gemFilters.isCertified = 'false';
    }
  }

  return gemFilters;
}

// ──────────────────────────────────────────────
// FilterSection Component
// ──────────────────────────────────────────────
const FilterSection: React.FC<FilterSectionProps> = ({ onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSectionsType>({
    gemName: true,
    caratWeight: true,
    priceRange: false,
    color: false,
    cutShape: false,
    clarity: false,
    origin: false,
    treatment: false,
    certification: false,
  })

  const toggleSection = (section: keyof ExpandedSectionsType) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const [filters, setFilters] = useState<FiltersType>({
    gemName: [],
    caratWeight: [0.5, 50],
    priceRange: [],
    color: [],
    cutShape: [],
    clarity: [],
    origin: [],
    treatment: [],
    certification: [],
  })

  // ──────────────────────────────────────────
  // Notify parent whenever filters change
  // ──────────────────────────────────────────
  useEffect(() => {
    const gemFilters = convertToGemFilters(filters);
    onFilterChange(gemFilters);
  }, [filters, onFilterChange])

  // ──────────────────────────────────────────
  // Cut/Shape options — values MATCH the database
  // ──────────────────────────────────────────
  const cutShapeOptions: CutShapeOption[] = [
    {
      id: 'Oval', label: 'Oval', icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10">
          <ellipse cx="24" cy="24" rx="14" ry="19" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="24" cy="24" rx="7" ry="10" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <line x1="24" y1="5" x2="24" y2="14" stroke="currentColor" strokeWidth="0.8" />
          <line x1="24" y1="34" x2="24" y2="43" stroke="currentColor" strokeWidth="0.8" />
          <line x1="10" y1="24" x2="17" y2="24" stroke="currentColor" strokeWidth="0.8" />
          <line x1="31" y1="24" x2="38" y2="24" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      )
    },
    {
      id: 'Round', label: 'Round', icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10">
          <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="8" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <line x1="24" y1="4" x2="24" y2="16" stroke="currentColor" strokeWidth="1" />
          <line x1="24" y1="32" x2="24" y2="44" stroke="currentColor" strokeWidth="1" />
          <line x1="4" y1="24" x2="16" y2="24" stroke="currentColor" strokeWidth="1" />
          <line x1="32" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="1" />
          <line x1="9" y1="9" x2="18" y2="18" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
          <line x1="39" y1="9" x2="30" y2="18" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
          <line x1="9" y1="39" x2="18" y2="30" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
          <line x1="39" y1="39" x2="30" y2="30" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
        </svg>
      )
    },
    {
      id: 'Cushion', label: 'Cushion', icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10">
          <rect x="6" y="6" width="36" height="36" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <rect x="14" y="14" width="20" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <line x1="6" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
          <line x1="14" y1="6" x2="14" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
          <line x1="34" y1="6" x2="34" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
          <line x1="34" y1="14" x2="42" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
          <line x1="6" y1="34" x2="14" y2="34" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
          <line x1="14" y1="34" x2="14" y2="42" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
          <line x1="34" y1="34" x2="34" y2="42" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
          <line x1="34" y1="34" x2="42" y2="34" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
        </svg>
      )
    },
    {
      id: 'Emerald', label: 'Emerald', icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10">
          <polygon points="12,6 36,6 44,14 44,34 36,42 12,42 4,34 4,14" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="16,12 32,12 38,18 38,30 32,36 16,36 10,30 10,18" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <line x1="4" y1="14" x2="10" y2="18" stroke="currentColor" strokeWidth="0.8" />
          <line x1="44" y1="14" x2="38" y2="18" stroke="currentColor" strokeWidth="0.8" />
          <line x1="4" y1="34" x2="10" y2="30" stroke="currentColor" strokeWidth="0.8" />
          <line x1="44" y1="34" x2="38" y2="30" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      )
    },
    {
      id: 'Pear', label: 'Pear', icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10">
          <path d="M24 4 C14 14 10 26 14 34 C18 42 30 42 34 34 C38 26 34 14 24 4 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M24 12 C19 18 17 26 19 31 C21 35 27 35 29 31 C31 26 29 18 24 12 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="24" y1="4" x2="24" y2="12" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      )
    },
    {
      id: 'Heart', label: 'Heart', icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10">
          <path d="M24 44 C8 30 4 20 10 12 C14 8 20 8 24 14 C28 8 34 8 38 12 C44 20 40 30 24 44 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M24 36 C14 28 12 22 15 17 C17 14 20 14 24 18 C28 14 31 14 33 17 C36 22 34 28 24 36 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="24" y1="14" x2="24" y2="22" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      )
    },
  ]

  // ──────────────────────────────────────────
  // Checkbox handler — toggles a value in an array
  // ──────────────────────────────────────────
  const handleCheckboxChange = (section: keyof FiltersType, value: string) => {
    setFilters(prev => {
      const currentValues = prev[section] as string[];
      return {
        ...prev,
        [section]: currentValues.includes(value)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value]
      }
    })
  }

  const handleCutShapeSelect = (value: string) => {
    handleCheckboxChange('cutShape', value)
  }

  // ──────────────────────────────────────────
  // Reset all filters to defaults
  // ──────────────────────────────────────────
  const handleResetAll = () => {
    setFilters({
      gemName: [],
      caratWeight: [0.5, 50],
      priceRange: [],
      color: [],
      cutShape: [],
      clarity: [],
      origin: [],
      treatment: [],
      certification: [],
    })
  }

  // ──────────────────────────────────────────
  // Reusable sub-components
  // ──────────────────────────────────────────
  const FilterCheckbox: React.FC<FilterCheckboxProps> = ({ label, section, value }) => (
    <label className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 px-2 rounded">
      <input
        type="checkbox"
        checked={(filters[section] as string[]).includes(value)}
        onChange={() => handleCheckboxChange(section, value)}
        className="w-5 h-5 rounded-full border-2 border-gray-300 cursor-pointer accent-red-500"
      />
      <span className="text-gray-700 text-sm">{label}</span>
    </label>
  )

  const CutShapeSelector: React.FC = () => (
    <div className="grid grid-cols-3 gap-4">
      {cutShapeOptions.map((shape) => (
        <button
          key={shape.id}
          onClick={() => handleCutShapeSelect(shape.id)}
          className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
            (filters.cutShape as string[]).includes(shape.id)
              ? 'border-red-500 bg-red-50 text-red-500'
              : 'border-gray-200 bg-white hover:border-gray-300 text-gray-400'
          }`}
        >
          {shape.icon}
          <span className="text-xs font-medium text-center text-gray-700">{shape.label}</span>
        </button>
      ))}
    </div>
  )

  const FilterSection_Component: React.FC<FilterSectionComponentProps> = ({ title, sectionKey, children }) => (
    <div className="border-b border-gray-200">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition"
      >
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {expandedSections[sectionKey] ? (
          <ChevronUp size={20} className="text-gray-600" />
        ) : (
          <ChevronDown size={20} className="text-gray-600" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="px-4 pb-4">{children}</div>
      )}
    </div>
  )

  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between py-4 px-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        <button
          onClick={handleResetAll}
          className="text-red-500 hover:text-red-600 text-sm font-medium transition"
        >
          Reset All
        </button>
      </div>

      {/* Gem Name */}
      <FilterSection_Component title="Gem Type" sectionKey="gemName">
        <div className="space-y-1">
          <FilterCheckbox label="Blue Sapphire" section="gemName" value="Blue Sapphire" />
          <FilterCheckbox label="Sapphire" section="gemName" value="Sapphire" />
          <FilterCheckbox label="Ruby" section="gemName" value="Ruby" />
          <FilterCheckbox label="Alexandrite" section="gemName" value="Alexandrite" />
          <FilterCheckbox label="Tourmaline" section="gemName" value="Tourmaline" />
          <FilterCheckbox label="Spinel" section="gemName" value="Spinel" />
          <FilterCheckbox label="Padparadscha" section="gemName" value="Padparadscha" />
        </div>
      </FilterSection_Component>

      {/* Carat Weight */}
      <FilterSection_Component title="Carat Weight" sectionKey="caratWeight">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-red-500 text-sm font-medium">{filters.caratWeight[0]} ct</span>
            <span className="text-red-500 text-sm font-medium">{filters.caratWeight[1]} ct</span>
          </div>

          {/* Min slider */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Minimum</label>
            <input
              type="range"
              min="0.5"
              max="50"
              step="0.5"
              value={filters.caratWeight[0]}
              onChange={(e) => {
                const newMin = parseFloat(e.target.value);
                setFilters(prev => ({
                  ...prev,
                  // Ensure min doesn't exceed max
                  caratWeight: [
                    Math.min(newMin, prev.caratWeight[1] - 0.5),
                    prev.caratWeight[1]
                  ]
                }))
              }}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          {/* Max slider */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Maximum</label>
            <input
              type="range"
              min="0.5"
              max="50"
              step="0.5"
              value={filters.caratWeight[1]}
              onChange={(e) => {
                const newMax = parseFloat(e.target.value);
                setFilters(prev => ({
                  ...prev,
                  // Ensure max doesn't go below min
                  caratWeight: [
                    prev.caratWeight[0],
                    Math.max(newMax, prev.caratWeight[0] + 0.5)
                  ]
                }))
              }}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 py-2 px-3 bg-gray-100 rounded-full text-sm font-medium text-gray-700 text-center">
              Min: {filters.caratWeight[0]} ct
            </div>
            <div className="flex-1 py-2 px-3 bg-gray-100 rounded-full text-sm font-medium text-gray-700 text-center">
              Max: {filters.caratWeight[1]} ct
            </div>
          </div>
        </div>
      </FilterSection_Component>

      {/* ─── Price ─── */}
      <FilterSection_Component title="Price" sectionKey="priceRange">
        <div className="space-y-1">
          <FilterCheckbox label="Under $100,000" section="priceRange" value="under100k" />
          <FilterCheckbox label="$100,000 - $250,000" section="priceRange" value="100kto250k" />
          <FilterCheckbox label="$250,000 - $500,000" section="priceRange" value="250kto500k" />
          <FilterCheckbox label="$500,000+" section="priceRange" value="above500k" />
        </div>
      </FilterSection_Component>

      {/* ─── Color ─── */}
      <FilterSection_Component title="Color" sectionKey="color">
        <div className="space-y-1">
          <FilterCheckbox label="Blue" section="color" value="Blue" />
          <FilterCheckbox label="Light Blue" section="color" value="Light blue" />
          <FilterCheckbox label="Red" section="color" value="Red" />
          <FilterCheckbox label="Natural Red" section="color" value="Natural Red" />
        </div>
      </FilterSection_Component>

      {/* ─── Cut / Shape ─── */}
      <FilterSection_Component title="Cut / Shape" sectionKey="cutShape">
        <CutShapeSelector />
      </FilterSection_Component>

      {/* ─── Clarity ─── */}
      <FilterSection_Component title="Clarity" sectionKey="clarity">
        <div className="space-y-1">
          <FilterCheckbox label="Opaque" section="clarity" value="Opaque" />
        </div>
      </FilterSection_Component>

      {/* ─── Origin ─── */}
      <FilterSection_Component title="Origin" sectionKey="origin">
        <div className="space-y-1">
          <FilterCheckbox label="Sri Lankan" section="origin" value="Sri Lankan" />
          <FilterCheckbox label="Natural" section="origin" value="Natural" />
        </div>
      </FilterSection_Component>

      {/* ─── Treatment ─── */}
      <FilterSection_Component title="Treatment" sectionKey="treatment">
        <div className="space-y-1">
          <FilterCheckbox label="Unheated" section="treatment" value="Unheated" />
          <FilterCheckbox label="Natural" section="treatment" value="Natural" />
        </div>
      </FilterSection_Component>

      {/* ─── Certification ─── */}
      <FilterSection_Component title="Certification" sectionKey="certification">
        <div className="space-y-1">
          <FilterCheckbox label="NGJA Certified" section="certification" value="certified" />
          <FilterCheckbox label="Uncertified" section="certification" value="uncertified" />
        </div>
      </FilterSection_Component>
    </div>
  )
}

export default FilterSection