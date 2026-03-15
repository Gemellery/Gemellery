import { useState, useEffect, useRef } from 'react'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'

// ===============================================
// Props — what the parent (Marketplace) passes in
// ===============================================
interface FilterBarProps {
  onSortChange: (sort: string) => void;
  onShowFilters: () => void;
  onClearFilters?: () => void;
  totalResults: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ onSortChange, onShowFilters, onClearFilters }) => {
  const [sortBy, setSortBy] = useState('Newest')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // ===============================================
  // Close dropdown when clicking outside
  // ===============================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  // ===============================================
  // Sort change handler — immediate, no debounce needed
  // ===============================================
  const handleSortChange = (option: string) => {
    setSortBy(option)
    setIsDropdownOpen(false)
    onSortChange(option)   
  }

  const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Popular']

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          {/* Filters Toggle Button */}
          <button
            onClick={onShowFilters}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-full bg-white hover:bg-gray-50 text-gray-800 focus:outline-none transition-colors shadow-sm font-medium"
          >
            <SlidersHorizontal size={18} className="text-gray-600 shrink-0" />
            <span className="text-sm">Show filters</span>
          </button>

          {/* Remove Filters Button */}
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-full bg-[#CE0024] hover:bg-[#A8001D] text-white focus:outline-none transition-colors shadow-sm font-medium"
            >
              <X size={18} className="text-white shrink-0" />
              <span className="text-sm">Remove filters</span>
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3" ref={dropdownRef}>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 border-0 bg-transparent text-gray-800 hover:text-gray-600 focus:outline-none transition-colors"
            >
              <span className="text-sm font-medium">Sort by: {sortBy}</span>
              <ChevronDown size={18} className={`transition-transform text-gray-600 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      sortBy === option ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
