import { useState, useEffect, useCallback } from 'react'
import SearchBar from '../../components/SearchBar'
import FilterSection from '../../components/FilterSection'
import Navbar from '@/components/Navbar'
import AdvancedFooter from '../../components/AdvancedFooter'
import GemCard from '../../components/GemCard'
import { ChevronLeft, ChevronRight, Filter, X, Loader2, AlertCircle } from 'lucide-react'
import { fetchGems } from '@/lib/gems/api'
import { transformGemForCard } from '@/lib/gems/utils'
import type { GemFilters } from '@/lib/gems/types'
import type { GemCardDisplay } from '@/lib/gems/utils'

const GEMS_PER_PAGE = 12

const Marketplace = () => {
  // ──────────────────────────────────────────
  // State
  // ──────────────────────────────────────────
  const [gems, setGems] = useState<GemCardDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalGems, setTotalGems] = useState(0)
  const [filters, setFilters] = useState<GemFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Newest')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // ──────────────────────────────────────────
  // Fetch gems from the API
  // ──────────────────────────────────────────
  const loadGems = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Build the combined filter params
      const params: GemFilters = {
        ...filters,              
        page: currentPage,       
        limit: GEMS_PER_PAGE,    
      }

      // Add search query if user typed something
      if (searchQuery && !filters.search) {
        params.search = searchQuery
      }

      // Make the API call
      const response = await fetchGems(params)

      // Transform each gem for display
      const displayGems = response.data.map(transformGemForCard)

      // Client-side sorting
      const sortedGems = sortGems(displayGems, sortBy)

      // Update state 
      setGems(sortedGems)
      setTotalPages(Math.ceil(response.pagination.total / GEMS_PER_PAGE))
      setTotalGems(response.pagination.total)

    } catch (err) {
      // err could be an Error object or something else
      const message = err instanceof Error ? err.message : 'Failed to load gems'
      setError(message)
      console.error('Error loading gems:', err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, filters, searchQuery, sortBy])

  // ──────────────────────────────────────────
  // Client-side sort helper
  // ──────────────────────────────────────────
  function sortGems(gems: GemCardDisplay[], sort: string): GemCardDisplay[] {
    const sorted = [...gems]

    switch (sort) {
      case 'Price: Low to High':
        sorted.sort((a, b) => a.numericPrice - b.numericPrice)
        break
      case 'Price: High to Low':
        sorted.sort((a, b) => b.numericPrice - a.numericPrice)
        break
      case 'Most Popular':
        // No popularity data in DB yet — keep current order
        break
      case 'Newest':
      default:
        // Backend already returns newest first (ORDER BY created_at DESC)
        // so we don't need to re-sort
        break
    }

    return sorted
  }

  // ──────────────────────────────────────────
  // Trigger fetch when dependencies change
  // ──────────────────────────────────────────
  useEffect(() => {
    loadGems()
  }, [loadGems])

  // ──────────────────────────────────────────
  // Callback: FilterSection changed
  // ──────────────────────────────────────────
  const handleFilterChange = useCallback((newFilters: GemFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) 
  }, [])

  // ──────────────────────────────────────────
  // Callback: SearchBar search query changed
  // ──────────────────────────────────────────
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, [])

  // ──────────────────────────────────────────
  // Callback: SearchBar sort option changed
  // ──────────────────────────────────────────

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort)
  }, [])

  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section — unchanged */}
      <div className="bg-linear-to-r from-amber-50 to-orange-50 px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Discover Ceylon's Finest Gems
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-red-500 font-medium">
          Verified luxury gemstones from the heart of Sri Lanka.
        </p>
      </div>

      {/* Search Bar — now wired to callbacks */}
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        <SearchBar
          onSearch={handleSearch}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* Filters Sidebar — desktop */}
          <div className="hidden lg:block lg:w-72 shrink-0">
            <FilterSection onFilterChange={handleFilterChange} />
          </div>

          {/* Mobile/Tablet Filter Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700 mb-4 w-full sm:w-auto justify-center mx-auto sm:mx-0"
          >
            <Filter size={18} />
            Filters
          </button>

          {/* Mobile/Tablet Filters Modal */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
              <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-lg overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-lg">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4">
                  <FilterSection onFilterChange={handleFilterChange} />
                </div>
              </div>
            </div>
          )}

          {/* Gems Grid Area */}
          <div className="flex-1 flex flex-col items-center lg:items-start w-full">

            {/* Results count — shows "Showing 6 gems" */}
            <div className="w-full mb-4">
              <p className="text-sm text-gray-500">
                {loading ? 'Loading gems...' : `Showing ${gems.length} of ${totalGems} gems`}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 w-full">
                <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
                <p className="text-gray-500 text-lg">Loading gems...</p>
              </div>
            )}

            {/* Error State */}            
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-20 w-full">
                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                <p className="text-gray-700 text-lg font-medium mb-2">Something went wrong</p>
                <p className="text-gray-500 text-sm mb-6">{error}</p>
                <button
                  onClick={loadGems}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                >
                  Try Again
                </button>
              </div>
            )}

            {/*  Empty State  */}            
            {!loading && !error && gems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 w-full">
                <p className="text-gray-700 text-lg font-medium mb-2">No gems found</p>
                <p className="text-gray-500 text-sm">
                  Try adjusting your filters or search query.
                </p>
              </div>
            )}

            {/*  Gems Grid  */}
            {!loading && !error && gems.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8 w-full justify-items-center lg:justify-items-start">
                  {gems.map((gem) => (
                    <GemCard
                      key={gem.id}
                      id={gem.id.toString()}
                      name={gem.name}
                      price={gem.formattedPrice}
                      weight={gem.formattedWeight}
                      cut={gem.cut}
                      origin={gem.origin}
                      certification={gem.certificationLabel}
                      verified={gem.isVerified}
                      image={gem.imageUrl}
                    />
                  ))}
                </div>

                {/*  Pagination  */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto pb-2 w-full">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-10 h-10 rounded-lg font-medium transition text-sm ${
                          currentPage === page
                            ? 'bg-red-500 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <AdvancedFooter />
    </div>
  )
}

export default Marketplace