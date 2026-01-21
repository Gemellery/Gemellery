import React, { useState } from 'react'
import SearchBar from '../../components/SearchBar'
import FilterSection from '../../components/FilterSection'
import GemCard from '../../components/GemCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
      verified: true,
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
  ]

  const totalPages = Math.ceil(gems.length / gemsPerPage)
  const startIndex = (currentPage - 1) * gemsPerPage
  const displayedGems = gems.slice(startIndex, startIndex + gemsPerPage)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">Discover Ceylon's Finest Gems</h1>
        <p className="text-lg text-red-500 font-medium">Verified luxury gemstones from the heart of Sri Lanka.</p>
      </div>

      {/* Search Bar */}
      <div className="px-8 py-6">
        <SearchBar />
      </div>

      {/* Main Content */}
      <div className="px-8 pb-12">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-72">
            <FilterSection />
          </div>

          {/* Gems Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-6 mb-8">
              {displayedGems.map((gem) => (
                <GemCard key={gem.id} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition ${
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
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Marketplace