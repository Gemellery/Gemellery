import React, { useState } from 'react'
import { ZoomIn, RotateCcw, CheckCircle, Play } from 'lucide-react'

interface ProductGalleryProps {
  images?: string[]
  productName?: string
  videoThumbnail?: string
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images = [
    '/sample_gems/blue_sapphire_main.jpg',
    '/sample_gems/blue_sapphire_side1.jpg',
    '/sample_gems/blue_sapphire_top.jpg',
    '/sample_gems/blue_sapphire_side2.jpg',
  ],
  productName = 'Blue Sapphire',
  videoThumbnail
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleZoomToggle = () => {
    if (zoom > 1) {
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    } else {
      setZoom(2)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      const mainImageDiv = (e.currentTarget as HTMLElement).querySelector('[data-gallery-main]')
      if (mainImageDiv) {
        const rect = mainImageDiv.getBoundingClientRect()
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        const maxX = (zoom - 1) * rect.width / 2
        const maxY = (zoom - 1) * rect.height / 2
        setPosition({
          x: Math.max(-maxX, Math.min(maxX, newX)),
          y: Math.max(-maxY, Math.min(maxY, newY))
        })
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Display */}
      <div
        data-gallery-main
        className="relative w-full bg-[#f5f2ed] rounded-2xl overflow-hidden flex items-center justify-center"
        style={{ height: '460px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Verified Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
          <CheckCircle size={16} className="text-green-600 fill-green-600" />
          <span className="text-xs font-semibold text-green-700">Verified</span>
        </div>

        {/* Main Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={images[selectedImageIndex]}
            alt={`${productName} view ${selectedImageIndex + 1}`}
            className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
            style={{
              transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
              cursor: zoom > 1 ? 'grab' : 'default'
            }}
            draggable={false}
          />
        </div>

        {/* Controls - Bottom Right */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
          <button
            onClick={() => {}}
            className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2.5 shadow-md transition-colors duration-200"
            title="360° View"
          >
            <RotateCcw size={18} className="text-gray-700" />
          </button>
          <button
            onClick={handleZoomToggle}
            className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2.5 shadow-md transition-colors duration-200"
            title="Zoom"
          >
            <ZoomIn size={18} className="text-gray-700" />
          </button>
        </div>

        {/* Zoom Indicator */}
        {zoom > 1 && (
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
            {Math.round(zoom * 100)}%
          </div>
        )}
      </div>

      {/* Thumbnail Row */}
      <div className="flex gap-3 px-1">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-200 ${
              selectedImageIndex === index
                ? 'ring-2 ring-red-500 ring-offset-2 scale-105'
                : 'ring-1 ring-gray-200 hover:ring-gray-300'
            }`}
          >
            <img
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}

        {/* Video Thumbnail */}
        <button
          onClick={() => {}}
          className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden ring-1 ring-gray-200 hover:ring-gray-300 transition-all duration-200 relative bg-gray-900"
        >
          {videoThumbnail ? (
            <img src={videoThumbnail} alt="Video" className="w-full h-full object-cover opacity-70" />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <Play size={20} className="text-white fill-white" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center">
              <Play size={12} className="text-gray-900 fill-gray-900 ml-0.5" />
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

export default ProductGallery