import React, { useState } from 'react'
import SearchBar from '../../components/SearchBar'
import FilterSection from '../../components/FilterSection'
import Navbar from '@/components/Navbar'
import AdvancedFooter from '../../components/AdvancedFooter'
import GemCard from '../../components/GemCard'
import { ChevronLeft, ChevronRight, Filter, X } from 'lucide-react'

interface Gem {
  id: number
  name: string
  price: string
  weight: string
  cut: string
  origin: string
  certification: string
  verified: boolean
  image: string
}

const Marketplace = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const gemsPerPage = 12

  // Sample gem data - replace with API call
  const gems: Gem[] = [
    {
      id: 1,
      name: "Royal Blue Sapphire",
      price: "$4,250",
      weight: "2.05 ct",
      cut: "Cushion",
      origin: "Ceylon (Sri Lanka)",
      certification: "GRS Certified",
      verified: true,
      image: "https://placehold.co/400x300?text=Blue+Sapphire"
    },
    {
      id: 2,
      name: "Pigeon Blood Ruby",
      price: "$8,500",
      weight: "1.52 ct",
      cut: "Oval Cut",
      origin: "Burma",
      certification: "GIA Certified",
      verified: false,
      image: "https://placehold.co/400x300?text=Ruby"
    },
    {
      id: 3,
      name: "Padparadscha Sapphire",
      price: "$12,000",
      weight: "3.10 ct",
      cut: "Oval Cut",
      origin: "Ceylon (Sri Lanka)",
      certification: "GRS Certified",
      verified: true,
      image: "https://placehold.co/400x300?text=Padparadscha"
    },
    {
      id: 4,
      name: "Tsavorite Garnet",
      price: "$2,800",
      weight: "1.85 ct",
      cut: "Round Cut",
      origin: "Kenya",
      certification: "ICA Certified",
      verified: true,
      image: "https://placehold.co/400x300?text=Garnet"
    },
    {
      id: 5,
      name: "Teal Montana Sapphire",
      price: "$3,650",
      weight: "1.12 ct",
      cut: "Radiant Cut",
      origin: "USA",
      certification: "GIA Certified",
      verified: true,
      image: "https://placehold.co/400x300?text=Montana"
    },
    {
      id: 6,
      name: "Vivid Purple Spinel",
      price: "$1,950",
      weight: "2.55 ct",
      cut: "Pear Cut",
      origin: "Vietnam",
      certification: "EOL Certified",
      verified: true,
      image: "https://placehold.co/400x300?text=Spinel"
    },
    {
      id: 7,
      name: "Blue Sapphire",
      price: "$2,500",
      weight: "3.5 ct",
      cut: "Cushion",
      origin: "Sri Lanka",
      certification: "GIA",
      verified: true,
      image: "https://placehold.co/400x300?text=Spinel"
    }
  ]

  const totalPages = Math.ceil(gems.length / gemsPerPage)
  const startIndex = (currentPage - 1) * gemsPerPage
  const displayedGems = gems.slice(startIndex, startIndex + gemsPerPage)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">Discover Ceylon's Finest Gems</h1>
        <p className="text-sm sm:text-base md:text-lg text-red-500 font-medium">Verified luxury gemstones from the heart of Sri Lanka.</p>
      </div>

      {/* Search Bar */}
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        <SearchBar />
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar - Hidden on mobile and tablet, shown on large desktop */}
          <div className="hidden lg:block lg:w-72 flex-shrink-0">
            <FilterSection />
          </div>

          {/* Mobile and Tablet Filter Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700 mb-4 w-full sm:w-auto justify-center mx-auto sm:mx-0"
          >
            <Filter size={18} />
            Filters
          </button>

          {/* Mobile and Tablet Filters Modal */}
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
                  <FilterSection />
                </div>
              </div>
            </div>
          )}

          {/* Gems Grid */}
          <div className="flex-1 flex flex-col items-center lg:items-start w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8 w-full justify-items-center lg:justify-items-start">
              {displayedGems.map((gem) => (
                <GemCard 
                  key={gem.id}
                  id={gem.id.toString()}
                  name={gem.name}
                  price={gem.price}
                  weight={gem.weight}
                  cut={gem.cut}
                  origin={gem.origin}
                  certification={gem.certification}
                  verified={gem.verified}
                  image={gem.image}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto pb-2 w-full">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
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
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <AdvancedFooter/>
    </div>
  )
}

export default Marketplace