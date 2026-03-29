import React, { useState } from 'react'
import { Shield, QrCode, ExternalLink, Wallet, CheckCircle2, Loader2 } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import type { GemData } from '@/lib/gems/types'
import API_CONFIG from '@/lib/api.config'

interface GemPassportProps extends GemData {
  showClaimButton?: boolean;
  nft_claimed?: boolean;
  nft_owner_address?: string | null;
  onClaimed?: (txHash: string, walletAddress: string) => void;
}

const GemPassport: React.FC<GemPassportProps> = (props) => {
  const { showClaimButton, nft_claimed, nft_owner_address, onClaimed, ...data } = props;
  const [walletInput, setWalletInput] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [showWalletInput, setShowWalletInput] = useState(false);

  const etherscanUrl = data.tx_hash 
    ? `https://sepolia.etherscan.io/tx/${data.tx_hash}` 
    : null;

  const truncateHash = (hash: string) => {
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  const handleClaim = async () => {
    if (!walletInput) {
      setClaimError('Please enter your Ethereum wallet address');
      return;
    }

    const ethRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethRegex.test(walletInput)) {
      setClaimError('Invalid Ethereum address format (must start with 0x followed by 40 hex characters)');
      return;
    }

    setClaiming(true);
    setClaimError('');

    try {
      const token = localStorage.getItem('token');
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

      onClaimed?.(result.txHash, walletInput);
      setShowWalletInput(false);
    } catch (err: any) {
      setClaimError(err.message || 'Failed to claim NFT');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="bg-[#f8f7f5] border border-gray-100/80 rounded-2xl overflow-hidden">
      {/* Main Card */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          {/* Left Section */}
          <div className="flex-1 min-w-0">
            {/* Title Row */}
            <div className="flex items-center gap-2 mb-0.5">
              <Shield size={16} className="text-teal-600" />
              <h3 className="text-sm font-bold text-gray-900">Gem Passport</h3>
            </div>
            <p className="text-[11px] text-gray-400 mb-3 ml-6">
              Immutable Digital Certificate
            </p>

            {/* Certificate Details */}
            <div className="space-y-2.5 ml-6">
              <div>
                <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider mb-0.5">
                  Token ID
                </p>
                <p className="text-[13px] font-semibold text-gray-800 truncate" title={data.tx_hash || 'Not Minted'}>
                  {data.tx_hash ? truncateHash(data.tx_hash) : 'Not Minted'}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider mb-0.5">
                  Status
                </p>
                <p className="text-[13px] font-semibold text-gray-800 capitalize">
                  {data.blockchain_status === 'none' || data.blockchain_status === 'failed' 
                    ? 'Not Processed' 
                    : data.blockchain_status}
                </p>
              </div>

              {/* Etherscan Link */}
              {etherscanUrl && (
                <div>
                  <a
                    href={etherscanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    <ExternalLink size={11} />
                    View on Etherscan
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* QR Code */}
          <div className="flex-shrink-0 ml-4">
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
          </div>
        </div>
      </div>      

      {/* Claim to Wallet Section — Only shown on the Certificates page */}
      {showClaimButton && data.blockchain_status === 'minted' && (
        <div className="border-t border-gray-200/60 px-5 py-4 bg-gradient-to-b from-[#f8f7f5] to-[#f3f2ef]">
          {nft_claimed ? (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <CheckCircle2 size={16} className="text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
                  Transferred to Wallet
                </p>
                <p className="text-[12px] font-mono text-gray-600 truncate" title={nft_owner_address || ''}>
                  {nft_owner_address ? truncateHash(nft_owner_address) : 'Unknown'}
                </p>
              </div>
            </div>
          ) : showWalletInput ? (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Your Ethereum Wallet Address
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={walletInput}
                  onChange={(e) => { setWalletInput(e.target.value); setClaimError(''); }}
                  className="w-full px-3 py-2.5 text-[13px] font-mono bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all placeholder:text-gray-300"
                  disabled={claiming}
                />
                {claimError && (
                  <p className="text-[11px] text-red-500 mt-1.5">{claimError}</p>
                )}
                <p className="text-[10px] text-gray-400 mt-1.5">
                  This action is permanent. The NFT will be transferred to this address and cannot be reversed.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-[12px] font-bold uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {claiming ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Transferring...
                    </>
                  ) : (
                    <>
                      <Wallet size={14} />
                      Confirm Transfer
                    </>
                  )}
                </button>
                <button
                  onClick={() => { setShowWalletInput(false); setClaimError(''); setWalletInput(''); }}
                  disabled={claiming}
                  className="px-4 py-2.5 text-[12px] font-bold text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowWalletInput(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-[12px] font-bold uppercase tracking-wider rounded-xl hover:bg-black hover:text-white hover:border-black transition-all duration-300 shadow-sm group"
            >
              <Wallet size={14} className="group-hover:scale-110 transition-transform" />
              Claim to Your Wallet
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default GemPassport