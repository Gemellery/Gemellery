import React, { useState, useRef } from 'react'
import { Shield, QrCode, ExternalLink, Wallet, CheckCircle2, Loader2, Download, X } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import type { GemData } from '@/lib/gems/types'
import logoSvgRaw from '@/assets/logo.svg?raw'

// ─── Constants & Utils ───────────────────────────────────────────────────────

/**
 * Formats a value for display, returning a fallback if the value is empty or null.
 * @param v - The value to format (string, number, null, or undefined)
 * @param fallback - The string to return if v is empty or null (defaults to 'N/A')
 * @returns The formatted string or fallback
 */
const fmt = (v: string | number | null | undefined, fallback = 'N/A') =>
  v !== null && v !== undefined && String(v).trim() !== '' ? String(v) : fallback

// ─── Logo as base64 data URL so html2canvas can render the full SVG ────────
const logoDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(logoSvgRaw)))}`

/**
 * Renders the Gemellery logo as a base64 encoded image.
 * This ensures the logo is correctly captured when using html2canvas/html-to-image
 * even if there are cross-origin restrictions on external SVG files.
 */
const GemelleryLogoImg = () => (
  <img
    src={logoDataUrl}
    alt="Gemellery"
    style={{ width: '160px', height: 'auto', display: 'block' }}
    crossOrigin="anonymous"
  />
)



/**
 * CertificateCanvas Component
 * This component renders the high-fidelity certificate design that is used
 * to generate the downloadable PDF. It is typically hidden or rendered in a modal.
 * 
 * @param data - The gem data to populate the certificate
 * @param ref - React ref to the container element for screenshot capture
 */
const CertificateCanvas = React.forwardRef<HTMLDivElement, { data: GemData }>(
  ({ data }, ref) => {
    const isOnChain =
      data.blockchain_status !== 'none' && data.blockchain_status !== 'failed' && data.tx_hash

    const issueDate = data.minted_at
      ? new Date(data.minted_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : new Date(data.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })

    return (
      <div
        ref={ref}
        style={{
          width: '794px',
          minHeight: '562px',
          background: 'linear-gradient(135deg, #fdf8f0 0%, #fef9ed 40%, #fdf8f0 100%)',
          fontFamily: "'Georgia', 'Times New Roman', serif",
          position: 'relative',
          overflow: 'hidden',
          padding: '0',
          boxSizing: 'border-box',
        }}
      >
        {/* ── Gold corner ornaments ── */}
        {[
          { top: 0, left: 0, transform: 'none' },
          { top: 0, right: 0, transform: 'scaleX(-1)' },
          { bottom: 0, left: 0, transform: 'scaleY(-1)' },
          { bottom: 0, right: 0, transform: 'scale(-1,-1)' },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '80px',
              height: '80px',
              ...pos,
              zIndex: 1,
            }}
          >
            <svg viewBox="0 0 80 80" style={{ width: '100%', height: '100%' }}>
              <path d="M0,0 L80,0 L80,8 L8,8 L8,80 L0,80 Z" fill="#b8732a" opacity="0.85" />
              <path d="M0,0 L40,0 L40,3 L3,3 L3,40 L0,40 Z" fill="#DB8E2E" opacity="0.4" />
              <circle cx="8" cy="8" r="4" fill="#b8732a" />
              <circle cx="8" cy="8" r="2" fill="#e8a040" opacity="0.7" />
            </svg>
          </div>
        ))}

        {/* ── Background gem facet pattern ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              repeating-linear-gradient(60deg, transparent, transparent 30px, rgba(184,115,42,0.04) 30px, rgba(184,115,42,0.04) 31px),
              repeating-linear-gradient(-60deg, transparent, transparent 30px, rgba(184,115,42,0.04) 30px, rgba(184,115,42,0.04) 31px)
            `,
            zIndex: 0,
          }}
        />

        {/* ── Radial glow behind content ── */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(184,115,42,0.06) 0%, transparent 70%)',
            zIndex: 0,
          }}
        />

        {/* ── Main content ── */}
        <div style={{ position: 'relative', zIndex: 2, padding: '48px 56px' }}>

          {/* Header row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '28px',
              paddingBottom: '20px',
              borderBottom: '1px solid rgba(184,115,42,0.3)',
            }}
          >
            {/* Logo */}
            <div>
              <GemelleryLogoImg />
              <p
                style={{
                  color: '#7a5520',
                  fontSize: '9px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  marginTop: '4px',
                  fontFamily: "'Arial', sans-serif",
                }}
              >
                Blockchain-Verified Gem Registry
              </p>
            </div>

            {/* Certificate badge */}
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #b8732a, #DB8E2E)',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  padding: '4px 14px',
                  borderRadius: '2px',
                  fontFamily: "'Arial', sans-serif",
                  marginBottom: '6px',
                }}
              >
                {isOnChain ? '✦ On-Chain Verified' : '✦ Registered'}
              </div>
              <p
                style={{
                  color: '#5a4020',
                  fontSize: '9px',
                  letterSpacing: '1.5px',
                  fontFamily: "'Arial', sans-serif",
                }}
              >
                CERTIFICATE OF AUTHENTICITY
              </p>
            </div>
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1
              style={{
                color: '#3d2a0a',
                fontSize: '30px',
                fontWeight: 'normal',
                letterSpacing: '6px',
                textTransform: 'uppercase',
                margin: '0 0 6px 0',
                textShadow: '0 1px 2px rgba(184,115,42,0.2)',
              }}
            >
              {fmt(data.gem_name)}
            </h1>
            <p
              style={{
                color: '#7a5520',
                fontSize: '12px',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                fontFamily: "'Arial', sans-serif",
              }}
            >
              {fmt(data.gem_type)}
            </p>
            {/* decorative line */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '12px',
              }}
            >
              <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to right, transparent, #b8732a)' }} />
              <div style={{ color: '#b8732a', fontSize: '16px' }}>✦</div>
              <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to left, transparent, #b8732a)' }} />
            </div>
          </div>

          {/* ── Three-column spec grid ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            {[
              { label: 'Carat Weight', value: data.carat ? `${data.carat} ct` : 'N/A' },
              { label: 'Cut', value: fmt(data.cut) },
              { label: 'Clarity', value: fmt(data.clarity) },
              { label: 'Color', value: fmt(data.color) },
              { label: 'Origin', value: fmt(data.origin) },
              { label: 'Mining Region', value: fmt(data.mining_region) },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(184,115,42,0.25)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                }}
              >
                <p
                  style={{
                    color: '#7a5520',
                    fontSize: '8px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    margin: '0 0 3px 0',
                    fontFamily: "'Arial', sans-serif",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    color: '#1e1409',
                    fontSize: '13px',
                    margin: 0,
                    fontWeight: 'bold',
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* ── Seller & NGJA row ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '22px',
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(184,115,42,0.25)',
                borderRadius: '6px',
                padding: '10px 14px',
              }}
            >
              <p style={{ color: '#7a5520', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 3px 0', fontFamily: "'Arial', sans-serif" }}>
                Registered Seller
              </p>
              <p style={{ color: '#1e1409', fontSize: '13px', margin: 0, fontWeight: 'bold' }}>
                {fmt(data.business_name || data.seller_name)}
              </p>
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(184,115,42,0.25)',
                borderRadius: '6px',
                padding: '10px 14px',
              }}
            >
              <p style={{ color: '#7a5520', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 3px 0', fontFamily: "'Arial', sans-serif" }}>
                NGJA Certificate No.
              </p>
              <p style={{ color: '#1e1409', fontSize: '13px', margin: 0, fontWeight: 'bold' }}>
                {fmt(data.ngja_certificate_no)}
              </p>
            </div>
          </div>

          {/* ── Blockchain section ── */}
          {isOnChain && (
            <div
              style={{
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(184,115,42,0.35)',
                borderRadius: '8px',
                padding: '14px 16px',
                marginBottom: '22px',
              }}
            >
              <p
                style={{
                  color: '#7a5520',
                  fontSize: '8px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  margin: '0 0 6px 0',
                  fontFamily: "'Arial', sans-serif",
                }}
              >
                ⛓ Blockchain Transaction Hash (Ethereum Sepolia)
              </p>
              <p
                style={{
                  color: '#8a4f10',
                  fontSize: '10px',
                  wordBreak: 'break-all',
                  margin: 0,
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: '0.5px',
                }}
              >
                {data.tx_hash}
              </p>
            </div>
          )}

          {/* ── Footer row: date + QR + cert id ── */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingTop: '8px',
              borderTop: '1px solid rgba(184,115,42,0.25)',
              marginBottom: '8px',
            }}
          >
            <div>
              <p style={{ color: '#5a4020', fontSize: '9px', letterSpacing: '1.5px', margin: '0 0 2px 0', fontFamily: "'Arial', sans-serif" }}>
                DATE OF ISSUE
              </p>
              <p style={{ color: '#3d2a0a', fontSize: '12px', margin: 0 }}>{issueDate}</p>
            </div>

            {/* QR Code — directly below the line, no box */}
            {data.tx_hash && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <QRCodeCanvas
                  value={`https://sepolia.etherscan.io/tx/${data.tx_hash}`}
                  size={68}
                  fgColor="#5a3010"
                  bgColor="transparent"
                />
                <p style={{ color: '#5a4020', fontSize: '7px', letterSpacing: '1px', margin: 0, fontFamily: "'Arial', sans-serif", textTransform: 'uppercase' }}>
                  Verify on Etherscan
                </p>
              </div>
            )}

            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#5a4020', fontSize: '9px', letterSpacing: '1.5px', margin: '0 0 2px 0', fontFamily: "'Arial', sans-serif" }}>
                CERTIFICATE ID
              </p>
              <p style={{ color: '#3d2a0a', fontSize: '10px', margin: 0, fontFamily: "'Courier New', monospace" }}>
                GEM-{String(data.gem_id).padStart(6, '0')}
              </p>
              <p style={{ color: '#5a4020', fontSize: '8px', margin: '4px 0 0 0', fontFamily: "'Arial', sans-serif" }}>
                gemellery.lk
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
CertificateCanvas.displayName = 'CertificateCanvas'

/**
 * CertificateModal Component
 * Displays a preview of the Gem Certificate and provides functionality
 * to download it as a PDF document.
 * 
 * @param data - The gem data to display
 * @param onClose - Callback function to close the modal
 */
const CertificateModal: React.FC<{ data: GemData; onClose: () => void }> = ({
  data,
  onClose,
}) => {
  const certRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)

  /**
   * Generates a PDF from the CertificateCanvas component.
   * Uses html-to-image for the screenshot and jsPDF for the document creation.
   */
  const handleDownload = async () => {
    if (!certRef.current) return
    setLoading(true)
    try {
      // Dynamic imports to reduce bundle size
      const { toPng } = await import('html-to-image')
      const jsPDFModule = await import('jspdf')
      const JsPDFClass = (jsPDFModule.jsPDF ? jsPDFModule.jsPDF : (jsPDFModule.default || jsPDFModule)) as any

      // Use scrollWidth/scrollHeight — getBoundingClientRect clips to visible area
      // inside an overflow container, giving the wrong size and causing black space.
      const el = certRef.current
      const w = el.scrollWidth
      const h = el.scrollHeight

      // Capture the certificate content as a high-resolution PNG
      const imgData = await toPng(el, {
        quality: 1,
        pixelRatio: 2, // Higher pixel ratio for better print quality
        width: w,
        height: h,
        style: { overflow: 'visible' },
        backgroundColor: '#fdf8f0',
        skipFonts: false,
      })

      // Create PDF and add the image
      const orientation = w > h ? 'landscape' : 'portrait'
      const pdf = new JsPDFClass({ orientation, unit: 'px', format: [w, h] })
      pdf.addImage(imgData, 'PNG', 0, 0, w, h)
      
      // Save the generated PDF
      pdf.save(`Gemellery_Certificate_GEM-${String(data.gem_id).padStart(6, '0')}.pdf`)
    } catch (e) {
      console.error('Certificate generation failed:', e)
      alert('Failed to generate certificate. Please check the browser console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        padding: '40px 20px',
        overflowY: 'auto',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          maxWidth: '860px',
          width: '100%',
          margin: 'auto',
        }}
      >
        {/* Top action bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a07030' }}>
            <Shield size={16} />
            <span style={{ fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'Arial, sans-serif' }}>
              Gem Certificate Preview
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              id="download-certificate-btn"
              onClick={handleDownload}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #DB8E2E, #f0c060)',
                color: '#0f0f0f',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 18px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontFamily: 'Arial, sans-serif',
                letterSpacing: '0.5px',
              }}
            >
              {loading ? (
                <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Download size={15} />
              )}
              {loading ? 'Generating…' : 'Download PDF'}
            </button>
            <button
              id="close-certificate-modal-btn"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255,255,255,0.08)',
                color: '#ccc',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '9px 14px',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'Arial, sans-serif',
              }}
            >
              <X size={15} />
              Close
            </button>
          </div>
        </div>

        {/* Scrollable certificate preview */}
        <div
          style={{
            maxWidth: '100%',
            width: 'max-content',
            overflowX: 'auto',
            borderRadius: '12px',
            boxShadow: '0 25px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(219,142,46,0.2)',
          }}
        >
          <CertificateCanvas ref={certRef} data={data} />
        </div>

        <p style={{ color: '#555', fontSize: '11px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
          This certificate is generated on-demand and is not stored on our servers.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── Main exported component ───────────────────────────────────────────────
import API_CONFIG from '@/lib/api.config'

/**
 * Props for the GemPassport component
 * Extends GemData with additional UI-specific flags and callbacks
 */
interface GemPassportProps extends GemData {
  /** Whether to show the blockchain claim (transfer to wallet) button */
  showClaimButton?: boolean;
  /** Whether the NFT has already been claimed/transferred */
  nft_claimed?: boolean;
  /** The wallet address of the current NFT owner */
  nft_owner_address?: string | null;
  /** Callback triggered after a successful claim transaction */
  onClaimed?: (txHash: string, walletAddress: string) => void;
}

/**
 * GemPassport Component
 * 
 * The main UI component for displaying gem authenticity information.
 * Features:
 * - Summary view of gem specifications
 * - Blockchain status and transaction hash tracking
 * - QR code link to block explorer
 * - On-demand PDF certificate generation via modal
 * - Claim-to-wallet functionality for NFT-backed certificates
 */
const GemPassport: React.FC<GemPassportProps> = (props) => {
  const { showClaimButton, nft_claimed, nft_owner_address, onClaimed, ...data } = props;
  const [walletInput, setWalletInput] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [showWalletInput, setShowWalletInput] = useState(false);


  const truncateHash = (hash: string) => {
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  /**
   * Initiates the NFT claim process.
   * Validates the wallet address and sends a request to the backend
   * to transfer the certificate NFT to the user's wallet.
   */
  const handleClaim = async () => {
    // 1. Validate Input
    if (!walletInput) {
      setClaimError('Please enter your Ethereum wallet address');
      return;
    }

    // 2. Validate Ethereum Address Format
    const ethRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethRegex.test(walletInput)) {
      setClaimError('Invalid Ethereum address format (must start with 0x followed by 40 hex characters)');
      return;
    }

    setClaiming(true);
    setClaimError('');

    try {
      const token = localStorage.getItem('token');
      // 3. API Request to claim endpoint
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/buyer/certificates/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gem_id: data.gem_id,
          wallet_address: walletInput,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setClaimError(result.error || 'Failed to claim NFT');
        return;
      }

      // 4. Success callback
      onClaimed?.(result.txHash, walletInput);
      setShowWalletInput(false);
    } catch (err: any) {
      console.error('Claim error:', err);
      setClaimError(err.message || 'Failed to claim NFT');
    } finally {
      setClaiming(false);
    }
  };

  const [showCert, setShowCert] = useState(false);

  return (
    <>
      {/* ── Summary Card View ── */}
      <div className="bg-[#f8f7f5] border border-gray-100/80 rounded-2xl overflow-hidden">
        <div className="p-5">
          <div className="flex items-start justify-between">
            {/* Left Section: Gem Name & Status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Shield size={16} className="text-teal-600" />
                <h3 className="text-sm font-bold text-gray-900">Gem Passport</h3>
              </div>
              <p className="text-[11px] text-gray-400 mb-3 ml-6">Immutable Digital Certificate</p>

              <div className="space-y-2.5 ml-6">
                <div>
                  <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider mb-0.5">Token ID</p>
                  <p className="text-[13px] font-semibold text-gray-800 truncate" title={data.tx_hash || 'Not Minted'}>
                    {data.tx_hash ? truncateHash(data.tx_hash) : 'Not Minted'}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider mb-0.5">Status</p>
                  <p className="text-[13px] font-semibold text-gray-800 capitalize">
                    {data.blockchain_status === 'none' || data.blockchain_status === 'failed'
                      ? 'Not Processed'
                      : data.blockchain_status}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section: QR Link + View Modal Trigger */}
            <div className="flex-shrink-0 ml-4 flex flex-col items-center gap-2">
              <div className="bg-white rounded-xl p-3 w-24 h-24 flex items-center justify-center border border-gray-200/60 shadow-sm">
                {data.tx_hash ? (
                  <QRCodeCanvas
                    value={`https://sepolia.etherscan.io/tx/${data.tx_hash}`}
                    size={76}
                    fgColor="#111827"
                  />
                ) : (
                  <QrCode size={40} className="text-gray-400" />
                )}
              </div>

              <button
                id="view-certificate-btn"
                onClick={() => setShowCert(true)}
                className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-600 transition-colors group"
              >
                <ExternalLink size={11} className="group-hover:translate-x-0.5 transition-transform" />
                View Certificate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Claim to Wallet Section — Redesigned as per user request */}
      {showClaimButton && data.blockchain_status === 'minted' && (
        <div className="mt-4 p-6 bg-white border border-gray-100 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-50 via-teal-500/10 to-gray-50 opacity-50"></div>
          
          {nft_claimed ? (
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                <CheckCircle2 size={24} className="text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">
                  Transferred to Wallet
                </p>
                <div className="flex items-center gap-2">
                  <Wallet size={12} className="text-gray-400" />
                  <p className="text-[13px] font-mono font-bold text-gray-700 truncate" title={nft_owner_address || ''}>
                    {nft_owner_address ? nft_owner_address : 'Unknown Address'}
                  </p>
                </div>
              </div>
              <div className="hidden sm:block px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-tight">
                Confirmed
              </div>
            </div>
          ) : showWalletInput ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3 bg-teal-500 rounded-full"></div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">
                  Secure Wallet Address
                </label>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="0x..."
                  value={walletInput}
                  onChange={(e) => { setWalletInput(e.target.value); setClaimError(''); }}
                  className="w-full pl-4 pr-10 py-3 text-[14px] font-mono bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-400 transition-all placeholder:text-gray-300"
                  disabled={claiming}
                />
                <Wallet size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
              </div>

              {claimError && (
                <div className="p-3 bg-red-50 rounded-xl flex items-center gap-2 border border-red-100">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  <p className="text-[11px] text-red-600 font-medium">{claimError}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-black text-white text-[12px] font-bold uppercase tracking-widest rounded-2xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-[0.98]"
                >
                  {claiming ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Minting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Confirm Claim
                    </>
                  )}
                </button>
                <button
                  onClick={() => { setShowWalletInput(false); setClaimError(''); setWalletInput(''); }}
                  disabled={claiming}
                  className="px-6 py-3 text-[12px] font-bold text-gray-400 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
              
              <p className="text-[10px] text-gray-400 text-center px-4 leading-relaxed">
                <span className="font-bold text-gray-500">Notice:</span> This will permanently associate the physical gem with your digital wallet address on-chain.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="text-center sm:text-left">
                <h4 className="text-sm font-bold text-gray-900 mb-0.5">Claim to Your Wallet</h4>
                <p className="text-[11px] text-gray-500">Secure your digital certificate on the blockchain</p>
              </div>
              
              <button
                onClick={() => setShowWalletInput(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 bg-white border border-gray-200 text-gray-700 text-[12px] font-bold uppercase tracking-widest rounded-2xl hover:border-black hover:text-black hover:bg-black/5 transition-all duration-300 shadow-sm"
              >
                <Wallet size={16} />
                Begin Transfer
              </button>
            </div>
          )}
        </div>
      )}

      {showCert && <CertificateModal data={data} onClose={() => setShowCert(false)} />}
    </>
  )
}

export default GemPassport