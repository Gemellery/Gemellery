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
  image: string;
}

// ──────────────────────────────────────────────
// Price buckets — maps UI labels to actual number ranges
// ──────────────────────────────────────────────
const PRICE_BUCKETS: Record<string, { min?: number; max?: number }> = {
  under100k:   { max: 100000 },
  '100kto250k': { min: 100000, max: 250000 },
  '250kto500k': { min: 250000, max: 500000 },
  above500k:   { min: 500000 },
};

// ──────────────────────────────────────────────
// Convert internal filter state → GemFilters for the API
// ──────────────────────────────────────────────
function convertToGemFilters(filters: FiltersType): GemFilters {
  const gemFilters: GemFilters = {};
  if (filters.gemName.length === 1) {
    gemFilters.gemName = filters.gemName[0];
  } else if (filters.gemName.length > 1) {
    gemFilters.gemName = filters.gemName[0];
  }

  // Carat weight range
  if (filters.caratWeight[0] > 0.5) {
    gemFilters.caratMin = filters.caratWeight[0];
  }
  if (filters.caratWeight[1] < 50) {
    gemFilters.caratMax = filters.caratWeight[1];
  }

  // Price range — convert bucket string to min/max numbers
  if (filters.priceRange.length > 0) {
    const bucket = PRICE_BUCKETS[filters.priceRange[0]];
    if (bucket) {
      if (bucket.min !== undefined) gemFilters.priceMin = bucket.min;
      if (bucket.max !== undefined) gemFilters.priceMax = bucket.max;
    }
  }

  // Color — exact match (send first selected)
  if (filters.color.length > 0) {
    gemFilters.color = filters.color[0];
  }

  // Cut/Shape — exact match
  if (filters.cutShape.length > 0) {
    gemFilters.cut = filters.cutShape[0];
  }

  // Clarity — exact match
  if (filters.clarity.length > 0) {
    gemFilters.clarity = filters.clarity[0];
  }

  // Origin — exact match
  if (filters.origin.length > 0) {
    gemFilters.origin = filters.origin[0];
  }

  // Treatment → maps to gem_type column
  if (filters.treatment.length > 0) {
    gemFilters.gemType = filters.treatment[0];
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
    { id: 'Oval', label: 'Oval', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop' },
    { id: 'Round', label: 'Round', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop' },
    { id: 'Cushion', label: 'Cushion', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop' },
    { id: 'Emerald', label: 'Emerald', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop' },
    { id: 'Pear', label: 'Pear', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop' },
    { id: 'Heart', label: 'Heart', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop' },
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
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <img
            src={shape.image}
            alt={shape.label}
            className="w-16 h-16 object-cover rounded-md"
          />
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

      {/* ─── Carat Weight ─── */}
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