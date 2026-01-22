import React, { useState } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'

interface ProductGalleryProps {
  images?: string[]
  productName?: string
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images = [
    '/sample_gems/blue_sapphire_main.jpg',
    '/sample_gems/blue_sapphire_side1.jpg',
    '/sample_gems/blue_sapphire_top.jpg',
    '/sample_gems/blue_sapphire_side2.jpg',
  ],
  productName = 'Blue Sapphire'
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 1))
    setPosition({ x: 0, y: 0 })
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
        
        // Limit dragging bounds
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

  const handlePrevThumbnail = () => {
    setSelectedImageIndex(prev => (prev - 1 + images.length) % images.length)
  }

  const handleNextThumbnail = () => {
    setSelectedImageIndex(prev => (prev + 1) % images.length)
  }

  return (
    <div className="flex flex-col gap-6 bg-white p-6 rounded-lg">
      {/* Main Image Display with Zoom */}
      <div
        data-gallery-main
        className="relative w-full bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center cursor-move"
        style={{ height: '500px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Main Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={images[selectedImageIndex]}
            alt={`${productName} view ${selectedImageIndex + 1}`}
            className="object-contain transition-transform duration-200 select-none"
            style={{
              transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
              cursor: zoom > 1 ? 'grab' : 'default'
            }}
            draggable={false}
          />
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleZoomIn}
            className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-colors duration-200"
            title="Zoom in"
          >
            <ZoomIn size={20} className="text-gray-700" />
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-colors duration-200"
            title="Zoom out"
          >
            <ZoomOut size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Zoom Level Indicator */}
        {zoom > 1 && (
          <div className="absolute bottom-4 left-4 bg-black text-white px-3 py-1 rounded text-sm">
            {Math.round(zoom * 100)}%
          </div>
        )}
      </div>

      {/* Thumbnail Carousel */}
      <div className="relative flex items-center justify-center gap-2">
        {/* Left Arrow */}
        <button
          onClick={handlePrevThumbnail}
          className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
          title="Previous image"
        >
          <span className="text-lg">‹</span>
        </button>

        {/* Thumbnails Container */}
        <div className="flex gap-3 overflow-x-auto px-2 py-2 pb-3 max-w-full">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                selectedImageIndex === index
                  ? 'ring-2 ring-red-500 scale-105'
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
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNextThumbnail}
          className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
          title="Next image"
        >
          <span className="text-lg">›</span>
        </button>
      </div>

      {/* Image Counter */}
      <div className="text-center text-sm text-gray-500">
        Image {selectedImageIndex + 1} of {images.length}
      </div>
    </div>
  )
}

export default ProductGallery