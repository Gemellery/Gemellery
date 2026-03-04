import { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown } from 'lucide-react'

// ──────────────────────────────────────────────
// Props — what the parent (Marketplace) passes in
// ──────────────────────────────────────────────
interface SearchBarProps {
  onSearch: (query: string) => void;
  onSortChange: (sort: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onSortChange }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Newest')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // ──────────────────────────────────────────
  // Close dropdown when clicking outside
  // ──────────────────────────────────────────
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

  // ──────────────────────────────────────────
  // Debounced search — wait 300ms after user stops typing
  // ──────────────────────────────────────────
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchQuery)
    }, 300)

    // Cleanup: cancel the timer if searchQuery changes before 300ms
    return () => {
      clearTimeout(debounceTimer)
    }
  }, [searchQuery, onSearch])

  // ──────────────────────────────────────────
  // Sort change handler — immediate, no debounce needed
  // ──────────────────────────────────────────
  const handleSortChange = (option: string) => {
    setSortBy(option)
    setIsDropdownOpen(false)
    onSortChange(option)   
  }

  const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Popular']

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <div className="flex items-center gap-4">
        {/* Search Input — unchanged UI, same styling */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by shape, origin, or gemstone (e.g., Sapphire, 2.5ct)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Sort Dropdown — unchanged UI, wired to handleSortChange */}
        <div className="flex items-center gap-3" ref={dropdownRef}>
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <span className="text-sm font-medium">{sortBy}</span>
              <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                      sortBy === option ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
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

export default SearchBar