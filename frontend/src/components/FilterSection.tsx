import React, { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface FiltersType {
  gemType: (string | number)[];
  caratWeight: (string | number)[];
  price: (string | number)[];
  color: (string | number)[];
  cutShape: (string | number)[];
  clarity: (string | number)[];
  origin: (string | number)[];
  treatment: (string | number)[];
  certification: (string | number)[];
  sellerDelivery: (string | number)[];
}

interface ExpandedSectionsType {
  gemType: boolean;
  caratWeight: boolean;
  price: boolean;
  color: boolean;
  cutShape: boolean;
  clarity: boolean;
  origin: boolean;
  treatment: boolean;
  certification: boolean;
  sellerDelivery: boolean;
}

interface FilterCheckboxProps {
  label: string;
  section: keyof FiltersType;
  value: string | number;
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

const FilterSection = () => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSectionsType>({
    gemType: true,
    caratWeight: true,
    price: false,
    color: false,
    cutShape: false,
    clarity: false,
    origin: false,
    treatment: false,
    certification: false,
    sellerDelivery: false,
  })

  const toggleSection = (section: keyof ExpandedSectionsType) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const [filters, setFilters] = useState<FiltersType>({
    gemType: [],
    caratWeight: [0.5, 5.0],
    price: [],
    color: [],
    cutShape: [],
    clarity: [],
    origin: [],
    treatment: [],
    certification: [],
    sellerDelivery: [],
  })

  const cutShapeOptions: CutShapeOption[] = [
    { id: 'oval', label: 'Oval', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop' },
    { id: 'round', label: 'Round', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop' },
    { id: 'cushion', label: 'Cushion', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop' },
    { id: 'emerald', label: 'Emerald', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop' },
    { id: 'pear', label: 'Pear', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop' },
    { id: 'heart', label: 'Heart', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop' },
  ]

  const handleCheckboxChange = (section: keyof FiltersType, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [section]: prev[section].includes(value)
        ? prev[section].filter(item => item !== value)
        : [...prev[section], value]
    }))
  }

  const handleCutShapeSelect = (value: string) => {
    handleCheckboxChange('cutShape', value)
  }

  const handleResetAll = () => {
    setFilters({
      gemType: [],
      caratWeight: [0.5, 10],
      price: [],
      color: [],
      cutShape: [],
      clarity: [],
      origin: [],
      treatment: [],
      certification: [],
      sellerDelivery: [],
    })
  }

  const FilterCheckbox: React.FC<FilterCheckboxProps> = ({ label, section, value }) => (
    <label className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 px-2 rounded">
      <input
        type="checkbox"
        checked={filters[section].includes(value)}
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
            filters.cutShape.includes(shape.id)
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

      {/* Gem Type */}
      <FilterSection_Component title="Gem Type" sectionKey="gemType">
        <div className="space-y-1">
          <FilterCheckbox label="Blue Sapphire" section="gemType" value="Blue Sapphire" />
          <FilterCheckbox label="Ruby" section="gemType" value="Ruby" />
          <FilterCheckbox label="Padparadscha" section="gemType" value="Padparadscha" />
          <FilterCheckbox label="Spinel" section="gemType" value="Spinel" />
          <FilterCheckbox label="Other" section="gemType" value="Other" />
        </div>
      </FilterSection_Component>

      {/* Carat Weight */}
      <FilterSection_Component title="Carat Weight" sectionKey="caratWeight">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-red-500 text-sm font-medium">{filters.caratWeight[0]} ct</span>
            <span className="text-red-500 text-sm font-medium">{filters.caratWeight[1]}+ ct</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.1"
            value={filters.caratWeight[0]}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              caratWeight: [parseFloat(e.target.value), prev.caratWeight[1]]
            }))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
          <div className="flex gap-3">
            <button className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition">
              Min: {filters.caratWeight[0]}
            </button>
            <button className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition">
              Max: {filters.caratWeight[1]}
            </button>
          </div>
        </div>
      </FilterSection_Component>

      {/* Price */}
      <FilterSection_Component title="Price" sectionKey="price">
        <div className="space-y-1">
          <FilterCheckbox label="Under $100" section="price" value="under100" />
          <FilterCheckbox label="$100 - $500" section="price" value="100to500" />
          <FilterCheckbox label="$500 - $1000" section="price" value="500to1000" />
          <FilterCheckbox label="$1000+" section="price" value="above1000" />
        </div>
      </FilterSection_Component>

      {/* Color */}
      <FilterSection_Component title="Color" sectionKey="color">
        <div className="space-y-1">
          <FilterCheckbox label="Deep Blue" section="color" value="deepBlue" />
          <FilterCheckbox label="Medium Blue" section="color" value="mediumBlue" />
          <FilterCheckbox label="Light Blue" section="color" value="lightBlue" />
          <FilterCheckbox label="Colorless" section="color" value="colorless" />
          <FilterCheckbox label="Fancy" section="color" value="fancy" />
        </div>
      </FilterSection_Component>

      {/* Cut / Shape */}
      <FilterSection_Component title="Cut / Shape" sectionKey="cutShape">
        <CutShapeSelector />
      </FilterSection_Component>

      {/* Clarity */}
      <FilterSection_Component title="Clarity" sectionKey="clarity">
        <div className="space-y-1">
          <FilterCheckbox label="Included" section="clarity" value="included" />
          <FilterCheckbox label="Slightly Included" section="clarity" value="slightlyIncluded" />
          <FilterCheckbox label="Eye Clean" section="clarity" value="eyeClean" />
          <FilterCheckbox label="Flawless" section="clarity" value="flawless" />
        </div>
      </FilterSection_Component>

      {/* Origin */}
      {/* <FilterSection_Component title="Origin" sectionKey="origin">
        <div className="space-y-1">
          <FilterCheckbox label="Kashmir" section="origin" value="kashmir" />
          <FilterCheckbox label="Ceylon" section="origin" value="ceylon" />
          <FilterCheckbox label="Burmese" section="origin" value="burmese" />
          <FilterCheckbox label="Thai" section="origin" value="thai" />
          <FilterCheckbox label="African" section="origin" value="african" />
        </div>
      </FilterSection_Component> */}

      {/* Treatment */}
      <FilterSection_Component title="Treatment" sectionKey="treatment">
        <div className="space-y-1">
          <FilterCheckbox label="Untreated" section="treatment" value="untreated" />
          <FilterCheckbox label="Heat Treated" section="treatment" value="heatTreated" />
          <FilterCheckbox label="Treated (Other)" section="treatment" value="treatedOther" />
        </div>
      </FilterSection_Component>

      {/* Certification */}
      <FilterSection_Component title="Certification" sectionKey="certification">
        <div className="space-y-1">
          <FilterCheckbox label="GIA" section="certification" value="gia" />
          <FilterCheckbox label="SSEF" section="certification" value="ssef" />
          <FilterCheckbox label="AGL" section="certification" value="agl" />
          <FilterCheckbox label="Uncertified" section="certification" value="uncertified" />
        </div>
      </FilterSection_Component>

      {/* Seller / Delivery */}
      <FilterSection_Component title="Seller / Delivery" sectionKey="sellerDelivery">
        <div className="space-y-1">
          <FilterCheckbox label="Verified Seller" section="sellerDelivery" value="verifiedSeller" />
          <FilterCheckbox label="NGJA Verified" section="sellerDelivery" value="ngjaVerified" />
          <FilterCheckbox label="Top Rated Seller" section="sellerDelivery" value="topRatedSeller" />
          <FilterCheckbox label="Ready to Ship" section="sellerDelivery" value="readyToShip" />
          <FilterCheckbox label="International Shipping" section="sellerDelivery" value="internationalShipping" />
        </div>
      </FilterSection_Component>
    </div>
  )
}

export default FilterSection