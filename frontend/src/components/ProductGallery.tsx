import React, { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ZoomIn, ZoomOut, RotateCcw, Play, CheckCircle, X, ChevronLeft, ChevronRight, Maximize2, Grid3X3 } from 'lucide-react'

interface ProductGalleryProps {
  images?: string[]
  productName?: string
  hasVideo?: boolean
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images = [
    '/sample_gems/blue_sapphire_main.jpg',
    '/sample_gems/blue_sapphire_side1.jpg',
    '/sample_gems/blue_sapphire_top.jpg',
    '/sample_gems/blue_sapphire_side2.jpg',
  ],
  productName = 'Blue Sapphire',
  hasVideo = true
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenZoom, setFullscreenZoom] = useState(1)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  const fullscreenRef = useRef<HTMLDivElement>(null)
  const mainImageRef = useRef<HTMLDivElement>(null)


  // Handle keyboard navigation in fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return
      switch (e.key) {
        case 'Escape':
          closeFullscreen()
          break
        case 'ArrowLeft':
          navigatePrev()
          break
        case 'ArrowRight':
          navigateNext()
          break
        case '+':
        case '=':
          setFullscreenZoom(prev => Math.min(prev + 0.5, 4))
          break
        case '-':
          setFullscreenZoom(prev => Math.max(prev - 0.5, 1))
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, selectedImageIndex, images.length])

  // Prevent body scroll when fullscreen is open
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isFullscreen])

  const openFullscreen = useCallback((index?: number) => {
    if (index !== undefined) setSelectedImageIndex(index)
    setIsFullscreen(true)
    setFullscreenZoom(1)
    setIsZoomed(false)
    setShowGrid(false)
  }, [])

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false)
    setFullscreenZoom(1)
    setIsZoomed(false)
    setShowGrid(false)
  }, [])

  const navigateNext = useCallback(() => {
    setIsTransitioning(true)
    setFullscreenZoom(1)
    setIsZoomed(false)
    setTimeout(() => {
      setSelectedImageIndex(prev => (prev + 1) % images.length)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 150)
  }, [images.length])

  const navigatePrev = useCallback(() => {
    setIsTransitioning(true)
    setFullscreenZoom(1)
    setIsZoomed(false)
    setTimeout(() => {
      setSelectedImageIndex(prev => (prev - 1 + images.length) % images.length)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 150)
  }, [images.length])

  const handleThumbnailClick = (index: number) => {
    if (index === selectedImageIndex) return
    setIsTransitioning(true)
    setFullscreenZoom(1)
    setIsZoomed(false)
    setTimeout(() => {
      setSelectedImageIndex(index)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 100)
  }

  const handleFullscreenZoomToggle = () => {
    if (isZoomed) {
      setFullscreenZoom(1)
      setIsZoomed(false)
    } else {
      setFullscreenZoom(2.5)
      setIsZoomed(true)
    }
  }

  const handleFullscreenMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  // Hover zoom on inline image
  const handleInlineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  return (
    <>
      {/* ============ INLINE GALLERY ============ */}
      <div className="flex flex-col gap-3">
        {/* Main Image Display */}
        <div
          ref={mainImageRef}
          className="relative w-full bg-gradient-to-br from-[#faf9f7] to-[#f0ede8] rounded-2xl overflow-hidden flex items-center justify-center group cursor-pointer"
          style={{ aspectRatio: '1 / 0.85' }}
          onClick={() => openFullscreen(selectedImageIndex)}
          onMouseMove={handleInlineMouseMove}
        >
          {/* Verified Badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
            <CheckCircle size={13} className="text-emerald-500" />
            <span className="text-[11px] font-semibold text-gray-700 tracking-wide">Verified</span>
          </div>

          {/* Image Counter */}
          <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {selectedImageIndex + 1} / {images.length}
          </div>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <img
              src={images[selectedImageIndex]}
              alt={`${productName} view ${selectedImageIndex + 1}`}
              className={`max-w-full max-h-full object-contain select-none transition-all duration-500 ease-out ${
                isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
              style={{
                filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.10))'
              }}
              draggable={false}
            />
          </div>

          {/* Fullscreen hint overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />

          {/* Click to expand hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3.5 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0 translate-y-2 pointer-events-none">
            <Maximize2 size={13} className="text-gray-600" />
            <span className="text-[11px] font-semibold text-gray-600 tracking-wide">Click to expand</span>
          </div>

          {/* Inline Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigatePrev() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-100/50 z-10"
              >
                <ChevronLeft size={16} className="text-gray-700" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigateNext() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-100/50 z-10"
              >
                <ChevronRight size={16} className="text-gray-700" />
              </button>
            </>
          )}

          {/* Bottom Right Controls */}
          <div className="absolute bottom-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => { e.stopPropagation() }}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 border border-gray-100/50"
              title="360° View"
            >
              <RotateCcw size={14} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Thumbnail Row */}
        <div className="flex items-center gap-2.5 px-0.5">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                selectedImageIndex === index
                  ? 'border-gray-900 shadow-md scale-105'
                  : 'border-gray-200/80 hover:border-gray-400 opacity-70 hover:opacity-100'
              }`}
              style={{ width: 64, height: 64 }}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Selected indicator dot */}
              {selectedImageIndex === index && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-900 rounded-full" />
              )}
            </button>
          ))}
          
          {/* Video Thumbnail */}
          {hasVideo && (
            <button
              className="flex-shrink-0 rounded-xl overflow-hidden border-2 border-gray-200/80 hover:border-gray-400 transition-all duration-300 relative bg-gray-900 opacity-70 hover:opacity-100"
              style={{ width: 64, height: 64 }}
            >
              <img
                src={images[0]}
                alt="Video thumbnail"
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-7 h-7 bg-white/95 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                  <Play size={10} className="text-gray-800 ml-0.5" fill="currentColor" />
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* ============ FULLSCREEN LIGHTBOX ============ */}
      {isFullscreen && createPortal(
        <div
          ref={fullscreenRef}
          className="fixed inset-0 z-[9999] flex flex-col"
          style={{
            animation: 'galleryFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0a0a0a]" onClick={closeFullscreen} />

          {/* Top Bar */}
          <div className="relative z-20 flex items-center justify-between px-6 py-4">
            {/* Left - counter */}
            <div className="flex items-center gap-3">
              <span className="text-white/90 text-sm font-medium tracking-wider">
                {selectedImageIndex + 1} <span className="text-white/40 mx-1">/</span> {images.length}
              </span>
              <span className="text-white/30 text-xs hidden sm:inline">•</span>
              <span className="text-white/50 text-xs font-light hidden sm:inline tracking-wide">{productName}</span>
            </div>

            {/* Center - zoom controls */}
            <div className="flex items-center gap-1 bg-white/8 rounded-full px-1.5 py-1 backdrop-blur-sm border border-white/10">
              <button
                onClick={() => setFullscreenZoom(prev => Math.max(prev - 0.5, 1))}
                disabled={fullscreenZoom <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom Out"
              >
                <ZoomOut size={15} />
              </button>
              <span className="text-white/60 text-[11px] font-mono min-w-[40px] text-center">
                {Math.round(fullscreenZoom * 100)}%
              </span>
              <button
                onClick={() => setFullscreenZoom(prev => Math.min(prev + 0.5, 4))}
                disabled={fullscreenZoom >= 4}
                className="w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom In"
              >
                <ZoomIn size={15} />
              </button>
            </div>

            {/* Right - actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
                  showGrid
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title="Grid View"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={closeFullscreen}
                className="w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                title="Close (Esc)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ---- Grid View ---- */}
          {showGrid ? (
            <div className="relative z-10 flex-1 overflow-y-auto px-6 py-4">
              <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImageIndex(index)
                      setShowGrid(false)
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square group/gridItem transition-all duration-300 ${
                      selectedImageIndex === index ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-transparent' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${productName} view ${index + 1}`}
                      className="w-full h-full object-cover group-hover/gridItem:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/gridItem:bg-black/20 transition-colors duration-300" />
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-1 rounded-md">
                      {index + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* ---- Single Image View ---- */}
              <div className="relative z-10 flex-1 flex items-center justify-center px-16 sm:px-20 overflow-hidden">
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={navigatePrev}
                      className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/8 hover:bg-white/15 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group/nav z-20"
                    >
                      <ChevronLeft size={20} className="text-white/70 group-hover/nav:text-white transition-colors" />
                    </button>
                    <button
                      onClick={navigateNext}
                      className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/8 hover:bg-white/15 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group/nav z-20"
                    >
                      <ChevronRight size={20} className="text-white/70 group-hover/nav:text-white transition-colors" />
                    </button>
                  </>
                )}

                {/* Main Fullscreen Image */}
                <div
                  className={`relative max-w-full max-h-full flex items-center justify-center ${
                    isZoomed ? 'cursor-crosshair' : 'cursor-zoom-in'
                  }`}
                  onClick={handleFullscreenZoomToggle}
                  onMouseMove={handleFullscreenMouseMove}
                  style={{ width: '100%', height: '100%' }}
                >
                  <img
                    src={images[selectedImageIndex]}
                    alt={`${productName} view ${selectedImageIndex + 1}`}
                    className={`max-h-full object-contain select-none transition-all ${
                      isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                    } ${isZoomed ? '' : 'duration-500 ease-out'}`}
                    style={{
                      maxWidth: '85%',
                      transform: isZoomed
                        ? `scale(${fullscreenZoom})`
                        : `scale(${fullscreenZoom})`,
                      transformOrigin: isZoomed
                        ? `${mousePos.x}% ${mousePos.y}%`
                        : 'center center',
                      transition: isZoomed
                        ? 'transform 0.1s ease-out, opacity 0.3s ease'
                        : 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                      filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.5))'
                    }}
                    draggable={false}
                  />
                </div>
              </div>

              {/* Bottom Thumbnail Strip */}
              <div className="relative z-20 flex justify-center py-4 px-6">
                <div className="flex items-center gap-2 bg-white/6 backdrop-blur-sm rounded-2xl px-3 py-2.5 border border-white/8">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
                        selectedImageIndex === index
                          ? 'ring-2 ring-white/80 ring-offset-1 ring-offset-black/50 scale-110 opacity-100'
                          : 'opacity-40 hover:opacity-80 hover:scale-105'
                      }`}
                      style={{ width: 56, height: 56 }}
                    >
                      <img
                        src={image}
                        alt={`${productName} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {hasVideo && (
                    <button
                      className="relative flex-shrink-0 rounded-lg overflow-hidden opacity-40 hover:opacity-80 transition-all duration-300 hover:scale-105 bg-gray-900"
                      style={{ width: 56, height: 56 }}
                    >
                      <img
                        src={images[0]}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover opacity-40"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                          <Play size={9} className="text-gray-800 ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Fullscreen Keyframes */}
          <style>{`
            @keyframes galleryFadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
          `}</style>
        </div>
      , document.body)}
    </>
  )
}

export default ProductGallery