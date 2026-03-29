import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterBar from '../../components/FilterBar'
import FilterSection from '../../components/FilterSection'
import Navbar from '@/components/Navbar'
import AdvancedFooter from '../../components/AdvancedFooter'
import GemCard from '../../components/GemCard'
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { fetchGems } from '@/lib/gems/api'
import { transformGemForCard } from '@/lib/gems/utils'
import type { GemFilters } from '@/lib/gems/types'
import type { GemCardDisplay } from '@/lib/gems/utils'

const GEMS_PER_PAGE = 12

const Marketplace = () => {
  /* === State === */
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || ''

  const [gems, setGems] = useState<GemCardDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalGems, setTotalGems] = useState(0)
  const [filters, setFilters] = useState<GemFilters>({})
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [sortBy, setSortBy] = useState('Newest')
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false)
  const [filterResetTrigger, setFilterResetTrigger] = useState(0)

  // Determine if filters are active
  const hasActiveFilters = Object.keys(filters).length > 0 || searchQuery !== ''

  // Listen for URL search param changes
  useEffect(() => {
    const q = searchParams.get('search') || ''
    setSearchQuery(q)
    setCurrentPage(1)
  }, [searchParams])

  /* === Fetch gems from the API === */
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

  /* === Client-side sort helper === */
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
        // No popularity data in DB yet
        break
      case 'Newest':
      default:
        // Backend already returns newest first (ORDER BY created_at DESC)
        break
    }

    return sorted
  }

  /* === Trigger fetch when dependencies change === */
  useEffect(() => {
    loadGems()
  }, [loadGems])

  /* === Callback: FilterSection changed === */
  const handleFilterChange = useCallback((newFilters: GemFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) 
  }, [])

  /* === Callback: SearchBar sort option changed === */
  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort)
  }, [])

  /* === Render === */
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 py-4">
          <div 
            className="relative px-4 sm:px-6 md:px-12 py-16 sm:py-24 rounded-2xl text-center bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: `url('/other_img/1.png')` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white mb-4 tracking-tight drop-shadow-lg">
                Discover Ceylon's Finest Gems
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-50 font-normal max-w-2xl mx-auto drop-shadow-md">
                Verified luxury gemstones from the heart of Sri Lanka.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar / Controls */}
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 py-2">
          <FilterBar
            onShowFilters={() => setShowFiltersDrawer(true)}
            onClearFilters={hasActiveFilters ? () => {
              setFilters({})
              setSearchQuery('')
              setCurrentPage(1)
              setFilterResetTrigger(prev => prev + 1)
            } : undefined}
            onSortChange={handleSortChange}
            totalResults={totalGems}
          />
        </div>

        {/* Main Content */}
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 pb-16 pt-2">
          <div className="flex flex-col w-full">
            
            {/* Active Search / Loading Status */}
            <div className="w-full mb-6">
              <p className="text-sm text-gray-500 font-medium">
                {searchQuery && <span className="mr-2">Results for "{searchQuery}" &bull;</span>}
                {loading ? 'Loading layout...' : `${totalGems} results found`}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 w-full">
                <Loader2 className="w-10 h-10 text-gray-400 animate-spin mb-4" />
                <p className="text-gray-500 text-lg">Loading items...</p>
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
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  Try Again
                </button>
              </div>
            )}

            {/*  Empty State  */}            
            {!loading && !error && gems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 w-full">
                <p className="text-gray-700 text-lg font-medium mb-2">No items found</p>
                <p className="text-gray-500 text-sm">
                  Try adjusting your filters or search query.
                </p>
              </div>
            )}

            {/*  Gems Grid  */}
            {!loading && !error && gems.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 w-full justify-items-center">
                  {gems.map((gem) => (
                    <GemCard
                      key={gem.id}
                      id={gem.id.toString()}
                      name={gem.name}
                      price={gem.formattedPrice}
                      weight={gem.formattedWeight}
                      cut={gem.cut}
                      origin={gem.origin}
                      verified={gem.verified}
                      image={gem.imageUrl}
                    />
                  ))}
                </div>

                {/*  Pagination  */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 w-full mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center w-[42px] h-[42px] rounded-xl border border-gray-200 text-slate-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 bg-white shadow-sm"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`flex items-center justify-center w-[42px] h-[42px] rounded-xl font-semibold transition text-sm shadow-sm ${
                          currentPage === page
                            ? 'bg-[#CE0024] text-white border-transparent'
                            : 'border border-gray-200 text-[#121A2F] bg-white hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center w-[42px] h-[42px] rounded-xl border border-gray-200 text-slate-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 bg-white shadow-sm"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <AdvancedFooter />

      <FilterSection 
        isOpen={showFiltersDrawer}
        onClose={() => setShowFiltersDrawer(false)}
        onFilterChange={handleFilterChange} 
        resetTrigger={filterResetTrigger}
        totalResults={totalGems}
      />
    </div>
  )
}

export default Marketplace