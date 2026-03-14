import React, { useState, useEffect, useCallback } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import type { GemFilters } from '@/lib/gems/types'

/* === Props — what the parent (Marketplace) passes in === */

interface FilterSectionProps {
  onFilterChange: (filters: GemFilters) => void;
}
/* === Internal filter state shape === */
interface FiltersType {
  gemName: string[];
  caratWeight: [number, number];
  priceRange: string[];
  customPriceMin: string;      
  customPriceMax: string;
  color: string[];
  cutShape: string[];
  clarity: string[];
  miningRegion: string[];
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
  miningRegion: boolean;
  treatment: boolean;
  certification: boolean;
}

interface CutShapeOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

/* === Price buckets — maps UI labels to min-max ranges === */
const PRICE_BUCKETS: Record<string, { min: number; max: number | typeof Infinity }> = {
  under100k:    { min: 0,      max: 100000 },
  '100kto250k': { min: 100000, max: 250000 },
  '250kto500k': { min: 250000, max: 500000 },
  above500k:    { min: 500000, max: Infinity },
};

/* === Cut/Shape options === */
const CUT_SHAPE_OPTIONS: CutShapeOption[] = [
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

/* === Gem filter conversion === */
function convertToGemFilters(
  filters: FiltersType, 
  debouncedCustomPrice: { min: string; max: string }
): GemFilters {
  const gemFilters: GemFilters = {};

  if (filters.gemName.length > 0) {
    gemFilters.gemName = filters.gemName.join(',');
  }

  if (filters.caratWeight[0] > 0.5) {
    gemFilters.caratMin = filters.caratWeight[0];
  }
  if (filters.caratWeight[1] < 50) {
    gemFilters.caratMax = filters.caratWeight[1];
  }

  // Price Range
  const priceSelections = filters.priceRange.filter(key => key !== 'custom')

  if (priceSelections.length > 0 || filters.priceRange.includes('custom')) {
    const ranges: string[] = []

    priceSelections.forEach(key => {
      const bucket = PRICE_BUCKETS[key]
      if (bucket) {
        ranges.push(`${bucket.min}-${bucket.max === Infinity ? 'Infinity' : bucket.max}`)
      }
    })

    if (filters.priceRange.includes('custom')) {
      const customMin = debouncedCustomPrice.min ? parseFloat(debouncedCustomPrice.min) : 0
      const customMax = debouncedCustomPrice.max ? parseFloat(debouncedCustomPrice.max) : Infinity

      if (debouncedCustomPrice.min || debouncedCustomPrice.max) {
        ranges.push(`${customMin}-${customMax === Infinity ? 'Infinity' : customMax}`)
      }
    }

    if (ranges.length > 0) {
      gemFilters.priceRanges = ranges.join(',')
    }
  }

  // Color — separate normal colors from "Special Colors"
  if (filters.color.length > 0) {
    const normalColors = filters.color.filter(c => c !== 'Special Colors');
    const wantsSpecial = filters.color.includes('Special Colors');

    if (normalColors.length > 0) {
      gemFilters.color = normalColors.join(',');
    }

    if (wantsSpecial) {
      gemFilters.specialColors = 'true';
    }
  }

  if (filters.cutShape.length > 0) {
    gemFilters.cut = filters.cutShape.join(',');
  }

  if (filters.clarity.length > 0) {
    gemFilters.clarity = filters.clarity.join(',');
  }

  if (filters.miningRegion.length > 0) {
    gemFilters.miningRegion = filters.miningRegion.join(',');
  }

  if (filters.treatment.length > 0) {
    gemFilters.gemType = filters.treatment.join(',');
  }

  if (filters.certification.length > 0) {
    if (filters.certification.includes('certified') && !filters.certification.includes('uncertified')) {
      gemFilters.isCertified = 'true';
    } else if (filters.certification.includes('uncertified') && !filters.certification.includes('certified')) {
      gemFilters.isCertified = 'false';
    }
  }

  return gemFilters;
}

/* === Stable sub-components === */

const CollapsibleSection: React.FC<{
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = React.memo(({ title, isExpanded, onToggle, children }) => (
  <div className="border-b border-gray-200">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition"
    >
      <h3 className="font-semibold text-gray-800">{title}</h3>
      {isExpanded ? (
        <ChevronUp size={20} className="text-gray-600" />
      ) : (
        <ChevronDown size={20} className="text-gray-600" />
      )}
    </button>
    {isExpanded && (
      <div className="px-4 pb-4">{children}</div>
    )}
  </div>
))

const FilterCheckbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: () => void;
}> = React.memo(({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 px-2 rounded">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-5 h-5 rounded-full border-2 border-gray-300 cursor-pointer accent-red-500"
    />
    <span className="text-gray-700 text-sm">{label}</span>
  </label>
))

const CutShapeButton: React.FC<{
  shape: CutShapeOption;
  isSelected: boolean;
  onSelect: () => void;
}> = React.memo(({ shape, isSelected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
      isSelected
        ? 'border-red-500 bg-red-50 text-red-500'
        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-400'
    }`}
  >
    {shape.icon}
    <span className="text-xs font-medium text-center text-gray-700">{shape.label}</span>
  </button>
))

/* === FilterSection Component === */
const FilterSection: React.FC<FilterSectionProps> = ({ onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSectionsType>({
    gemName: true,
    caratWeight: true,
    priceRange: false,
    color: false,
    cutShape: false,
    clarity: false,
    miningRegion: false,
    treatment: false,
    certification: false,
  })

  const toggleSection = useCallback((section: keyof ExpandedSectionsType) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }, [])

  const [filters, setFilters] = useState<FiltersType>({
    gemName: [],
    caratWeight: [0.5, 50],
    priceRange: [],
    customPriceMin: '',
    customPriceMax: '',
    color: [],
    cutShape: [],
    clarity: [],
    miningRegion: [],
    treatment: [],
    certification: [],
  })

  // Debounced custom price state 
  const [debouncedCustomPrice, setDebouncedCustomPrice] = useState({
    min: '',
    max: '',
  })

  // Debounce the custom price inputs (800ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCustomPrice({
        min: filters.customPriceMin,
        max: filters.customPriceMax,
      })
    }, 800)

    return () => clearTimeout(timer)
  }, [filters.customPriceMin, filters.customPriceMax])

  // Single useEffect: fire onFilterChange when any filter changes
  useEffect(() => {
    const gemFilters = convertToGemFilters(filters, debouncedCustomPrice)
    onFilterChange(gemFilters)
  }, [
    filters.gemName,
    filters.caratWeight,
    filters.priceRange,
    filters.color,
    filters.cutShape,
    filters.clarity,
    filters.miningRegion,
    filters.treatment,
    filters.certification,
    debouncedCustomPrice,
  ])

  /* === Stable handlers with useCallback === */
  const handleCheckboxChange = useCallback((section: keyof FiltersType, value: string) => {
    setFilters(prev => {
      const currentValues = prev[section] as string[];
      return {
        ...prev,
        [section]: currentValues.includes(value)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value]
      }
    })
  }, [])

  const handleResetAll = useCallback(() => {
    setFilters({
      gemName: [],
      caratWeight: [0.5, 50],
      priceRange: [],
      customPriceMin: '',
      customPriceMax: '',
      color: [],
      cutShape: [],
      clarity: [],
      miningRegion: [],
      treatment: [],
      certification: [],
    })
  }, [])

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
      <CollapsibleSection title="Gem Type" isExpanded={expandedSections.gemName} onToggle={() => toggleSection('gemName')}>
        <div className="space-y-1">
          {['Blue Sapphire','Sapphire','Ruby','Alexandrite','Tourmaline','Spinel','Padparadscha','Quartz','Moonstone','Topaz','Zircon','Garnet','Chrysoberyl'].map(gem => (
            <FilterCheckbox
              key={gem}
              label={gem}
              checked={filters.gemName.includes(gem)}
              onChange={() => handleCheckboxChange('gemName', gem)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Carat Weight */}
      <CollapsibleSection title="Carat Weight" isExpanded={expandedSections.caratWeight} onToggle={() => toggleSection('caratWeight')}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-red-500 text-sm font-medium">{filters.caratWeight[0]} ct</span>
            <span className="text-red-500 text-sm font-medium">{filters.caratWeight[1]} ct</span>
          </div>

          <div
            className="relative h-10 flex items-center cursor-pointer select-none"
            style={{ touchAction: 'none' }}
            onClick={(e) => {
              const track = e.currentTarget
              const rect = track.getBoundingClientRect()
              const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
              const raw = 0.5 + ratio * (50 - 0.5)
              const snapped = Math.round(raw / 0.5) * 0.5
              const val = Math.max(0.5, Math.min(50, parseFloat(snapped.toFixed(1))))

              const distToMin = Math.abs(val - filters.caratWeight[0])
              const distToMax = Math.abs(val - filters.caratWeight[1])

              if (distToMin <= distToMax) {
                setFilters(prev => ({
                  ...prev,
                  caratWeight: [Math.min(val, prev.caratWeight[1] - 0.5), prev.caratWeight[1]]
                }))
              } else {
                setFilters(prev => ({
                  ...prev,
                  caratWeight: [prev.caratWeight[0], Math.max(val, prev.caratWeight[0] + 0.5)]
                }))
              }
            }}
          >
            <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded-full" />
            <div
              className="absolute h-1 bg-red-500 rounded-full transition-all duration-75 ease-out"
              style={{
                left: `${((filters.caratWeight[0] - 0.5) / (50 - 0.5)) * 100}%`,
                right: `${100 - ((filters.caratWeight[1] - 0.5) / (50 - 0.5)) * 100}%`,
              }}
            />

            {/* Min thumb */}
            <div
              className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 top-1/2 z-20
                         bg-white border-2 border-red-500 rounded-full shadow-md
                         cursor-grab active:cursor-grabbing
                         hover:scale-125 hover:shadow-lg hover:border-red-600
                         active:scale-110 active:shadow-lg active:border-red-700
                         transition-[transform,shadow,border-color] duration-150 ease-out"
              style={{ left: `${((filters.caratWeight[0] - 0.5) / (50 - 0.5)) * 100}%` }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                document.body.style.cursor = 'grabbing'
                document.body.style.userSelect = 'none'
                const track = e.currentTarget.parentElement!
                const onMove = (ev: MouseEvent) => {
                  const rect = track.getBoundingClientRect()
                  const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width))
                  const raw = 0.5 + ratio * (50 - 0.5)
                  const snapped = Math.round(raw / 0.5) * 0.5
                  const val = Math.max(0.5, Math.min(50, parseFloat(snapped.toFixed(1))))
                  setFilters(prev => ({
                    ...prev,
                    caratWeight: [Math.min(val, prev.caratWeight[1] - 0.5), prev.caratWeight[1]]
                  }))
                }
                const onUp = () => {
                  document.body.style.cursor = ''
                  document.body.style.userSelect = ''
                  document.removeEventListener('mousemove', onMove)
                  document.removeEventListener('mouseup', onUp)
                }
                document.addEventListener('mousemove', onMove)
                document.addEventListener('mouseup', onUp)
              }}
              onTouchStart={(e) => {
                e.stopPropagation()
                const track = e.currentTarget.parentElement!
                const onMove = (ev: TouchEvent) => {
                  if (!ev.touches[0]) return
                  const rect = track.getBoundingClientRect()
                  const ratio = Math.max(0, Math.min(1, (ev.touches[0].clientX - rect.left) / rect.width))
                  const raw = 0.5 + ratio * (50 - 0.5)
                  const snapped = Math.round(raw / 0.5) * 0.5
                  const val = Math.max(0.5, Math.min(50, parseFloat(snapped.toFixed(1))))
                  setFilters(prev => ({
                    ...prev,
                    caratWeight: [Math.min(val, prev.caratWeight[1] - 0.5), prev.caratWeight[1]]
                  }))
                }
                const onEnd = () => {
                  document.removeEventListener('touchmove', onMove)
                  document.removeEventListener('touchend', onEnd)
                }
                document.addEventListener('touchmove', onMove, { passive: false })
                document.addEventListener('touchend', onEnd)
              }}
            />

            {/* Max thumb */}
            <div
              className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 top-1/2 z-30
                         bg-white border-2 border-red-500 rounded-full shadow-md
                         cursor-grab active:cursor-grabbing
                         hover:scale-125 hover:shadow-lg hover:border-red-600
                         active:scale-110 active:shadow-lg active:border-red-700
                         transition-[transform,shadow,border-color] duration-150 ease-out"
              style={{ left: `${((filters.caratWeight[1] - 0.5) / (50 - 0.5)) * 100}%` }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                document.body.style.cursor = 'grabbing'
                document.body.style.userSelect = 'none'
                const track = e.currentTarget.parentElement!
                const onMove = (ev: MouseEvent) => {
                  const rect = track.getBoundingClientRect()
                  const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width))
                  const raw = 0.5 + ratio * (50 - 0.5)
                  const snapped = Math.round(raw / 0.5) * 0.5
                  const val = Math.max(0.5, Math.min(50, parseFloat(snapped.toFixed(1))))
                  setFilters(prev => ({
                    ...prev,
                    caratWeight: [prev.caratWeight[0], Math.max(val, prev.caratWeight[0] + 0.5)]
                  }))
                }
                const onUp = () => {
                  document.body.style.cursor = ''
                  document.body.style.userSelect = ''
                  document.removeEventListener('mousemove', onMove)
                  document.removeEventListener('mouseup', onUp)
                }
                document.addEventListener('mousemove', onMove)
                document.addEventListener('mouseup', onUp)
              }}
              onTouchStart={(e) => {
                e.stopPropagation()
                const track = e.currentTarget.parentElement!
                const onMove = (ev: TouchEvent) => {
                  if (!ev.touches[0]) return
                  const rect = track.getBoundingClientRect()
                  const ratio = Math.max(0, Math.min(1, (ev.touches[0].clientX - rect.left) / rect.width))
                  const raw = 0.5 + ratio * (50 - 0.5)
                  const snapped = Math.round(raw / 0.5) * 0.5
                  const val = Math.max(0.5, Math.min(50, parseFloat(snapped.toFixed(1))))
                  setFilters(prev => ({
                    ...prev,
                    caratWeight: [prev.caratWeight[0], Math.max(val, prev.caratWeight[0] + 0.5)]
                  }))
                }
                const onEnd = () => {
                  document.removeEventListener('touchmove', onMove)
                  document.removeEventListener('touchend', onEnd)
                }
                document.addEventListener('touchmove', onMove, { passive: false })
                document.addEventListener('touchend', onEnd)
              }}
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
      </CollapsibleSection>

      {/* === Price Range === */}
      <CollapsibleSection title="Price Range" isExpanded={expandedSections.priceRange} onToggle={() => toggleSection('priceRange')}>
        <div className="space-y-1">
          {[
            { label: 'Under Rs. 100,000', value: 'under100k' },
            { label: 'Rs. 100,000 - 250,000', value: '100kto250k' },
            { label: 'Rs. 250,000 - 500,000', value: '250kto500k' },
            { label: 'Over Rs. 500,000', value: 'above500k' },
          ].map(item => (
            <FilterCheckbox
              key={item.value}
              label={item.label}
              checked={filters.priceRange.includes(item.value)}
              onChange={() => handleCheckboxChange('priceRange', item.value)}
            />
          ))}

          {/* Custom price range */}
          <div className="pt-3 mt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={filters.priceRange.includes('custom')}
                onChange={() => {
                  setFilters(prev => {
                    const has = prev.priceRange.includes('custom')
                    return {
                      ...prev,
                      priceRange: has
                        ? prev.priceRange.filter(v => v !== 'custom')
                        : [...prev.priceRange, 'custom'],
                      ...(has ? { customPriceMin: '', customPriceMax: '' } : {})
                    }
                  })
                }}
                className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500 accent-red-500"
              />
              <span className="text-sm text-gray-700 font-medium">Custom</span>
            </label>

            {filters.priceRange.includes('custom') && (
              <div className="flex items-center gap-2 ml-6">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.customPriceMin}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, customPriceMin: e.target.value }))
                  }}
                  className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                             [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-sm text-gray-400">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.customPriceMax}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, customPriceMax: e.target.value }))
                  }}
                  className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                             [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* === Color === */}
      <CollapsibleSection title="Color" isExpanded={expandedSections.color} onToggle={() => toggleSection('color')}>
        <div className="space-y-1">
          {[
            { label: 'Blue', value: 'Blue' },
            { label: 'Red', value: 'Red' },
            { label: 'Green', value: 'Green' },
            { label: 'Yellow', value: 'Yellow' },
            { label: 'Pink', value: 'Pink' },
            { label: 'Purple', value: 'Purple' },
            { label: 'Orange', value: 'Orange' },
            { label: 'Brown', value: 'Brown' },            
            { label: 'Black', value: 'Black' },
            { label: 'White/Colorless', value: 'White/Colorless' },
            { label: 'Special Colors', value: 'Special Colors' },
          ].map(item => (
            <FilterCheckbox
              key={item.value}
              label={item.label}
              checked={filters.color.includes(item.value)}
              onChange={() => handleCheckboxChange('color', item.value)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* === Cut / Shape === */}
      <CollapsibleSection title="Cut / Shape" isExpanded={expandedSections.cutShape} onToggle={() => toggleSection('cutShape')}>
        <div className="grid grid-cols-3 gap-4">
          {CUT_SHAPE_OPTIONS.map((shape) => (
            <CutShapeButton
              key={shape.id}
              shape={shape}
              isSelected={filters.cutShape.includes(shape.id)}
              onSelect={() => handleCheckboxChange('cutShape', shape.id)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* === Clarity === */}
      <CollapsibleSection title="Clarity" isExpanded={expandedSections.clarity} onToggle={() => toggleSection('clarity')}>
        <div className="space-y-1">
          <FilterCheckbox label="VVS (Very Very Slightly Included)" checked={filters.clarity.includes('VVS')} onChange={() => handleCheckboxChange('clarity', 'VVS')} />
          <FilterCheckbox label="VS (Very Slightly Included)" checked={filters.clarity.includes('VS')} onChange={() => handleCheckboxChange('clarity', 'VS')} />
          <FilterCheckbox label="SI (Slightly Included)" checked={filters.clarity.includes('SI')} onChange={() => handleCheckboxChange('clarity', 'SI')} />
          <FilterCheckbox label="Included" checked={filters.clarity.includes('Included')} onChange={() => handleCheckboxChange('clarity', 'Included')} />
          <FilterCheckbox label="Excellent" checked={filters.clarity.includes('Excellent')} onChange={() => handleCheckboxChange('clarity', 'Excellent')} />
          <FilterCheckbox label="Very Good" checked={filters.clarity.includes('Very Good')} onChange={() => handleCheckboxChange('clarity', 'Very Good')} />
          <FilterCheckbox label="Good" checked={filters.clarity.includes('Good')} onChange={() => handleCheckboxChange('clarity', 'Good')} />
          <FilterCheckbox label="Fair" checked={filters.clarity.includes('Fair')} onChange={() => handleCheckboxChange('clarity', 'Fair')} />
          <FilterCheckbox label="Opaque" checked={filters.clarity.includes('Opaque')} onChange={() => handleCheckboxChange('clarity', 'Opaque')} />
        </div>
      </CollapsibleSection>

      {/* === Mining Region (replaces Origin) === */}
      <CollapsibleSection title="Mining Region" isExpanded={expandedSections.miningRegion} onToggle={() => toggleSection('miningRegion')}>
        <div className="space-y-1">
          <FilterCheckbox label="Ratnapura" checked={filters.miningRegion.includes('Ratnapura')} onChange={() => handleCheckboxChange('miningRegion', 'Ratnapura')} />
          <FilterCheckbox label="Elahera" checked={filters.miningRegion.includes('Elahera')} onChange={() => handleCheckboxChange('miningRegion', 'Elahera')} />
          <FilterCheckbox label="Meetiyagoda" checked={filters.miningRegion.includes('Meetiyagoda')} onChange={() => handleCheckboxChange('miningRegion', 'Meetiyagoda')} />
          <FilterCheckbox label="Balangoda / Pelmadulla" checked={filters.miningRegion.includes('Balangoda / Pelmadulla')} onChange={() => handleCheckboxChange('miningRegion', 'Balangoda / Pelmadulla')} />
          <FilterCheckbox label="Okkampitiya" checked={filters.miningRegion.includes('Okkampitiya')} onChange={() => handleCheckboxChange('miningRegion', 'Okkampitiya')} />
          <FilterCheckbox label="Kataragama" checked={filters.miningRegion.includes('Kataragama')} onChange={() => handleCheckboxChange('miningRegion', 'Kataragama')} />
          <FilterCheckbox label="Ambalangoda" checked={filters.miningRegion.includes('Ambalangoda')} onChange={() => handleCheckboxChange('miningRegion', 'Ambalangoda')} />
          <FilterCheckbox label="Other / Unknown" checked={filters.miningRegion.includes('Other / Unknown')} onChange={() => handleCheckboxChange('miningRegion', 'Other / Unknown')} />
        </div>
      </CollapsibleSection>

      {/* === Treatment === */}
      <CollapsibleSection title="Treatment" isExpanded={expandedSections.treatment} onToggle={() => toggleSection('treatment')}>
        <div className="space-y-1">
          <FilterCheckbox label="Natural" checked={filters.treatment.includes('Natural')} onChange={() => handleCheckboxChange('treatment', 'Natural')} />
          <FilterCheckbox label="Heated" checked={filters.treatment.includes('Heated')} onChange={() => handleCheckboxChange('treatment', 'Heated')} />
          <FilterCheckbox label="Unheated" checked={filters.treatment.includes('Unheated')} onChange={() => handleCheckboxChange('treatment', 'Unheated')} />
        </div>
      </CollapsibleSection>

      {/* === Certification === */}
      <CollapsibleSection title="Certification" isExpanded={expandedSections.certification} onToggle={() => toggleSection('certification')}>
        <div className="space-y-1">
          <FilterCheckbox label="NGJA Certified" checked={filters.certification.includes('certified')} onChange={() => handleCheckboxChange('certification', 'certified')} />
          <FilterCheckbox label="Uncertified" checked={filters.certification.includes('uncertified')} onChange={() => handleCheckboxChange('certification', 'uncertified')} />
        </div>
      </CollapsibleSection>
    </div>
  )
}

export default FilterSection