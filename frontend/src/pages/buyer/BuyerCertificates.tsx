import { useEffect, useState } from "react";
import BuyerSidebar from "../../components/BuyerSidebar";
import Footer from "../../components/BasicFooter";
import GemPassport from "../../components/GemPassport";
import { Shield, Menu, Gem } from "lucide-react";
import API_CONFIG from "../../lib/api.config";

interface Certificate {
  gem_id: number;
  gem_name: string;
  gem_type: string;
  carat: number;
  cut: string;
  clarity: string;
  color: string;
  origin: string;
  price: number;
  ngja_certificate_no: string;
  token_id: number;
  tx_hash: string;
  blockchain_status: string;
  minted_at: string;
  nft_claimed: boolean | number;
  nft_owner_address: string | null;
  seller_name: string;
  business_name: string;
  order_id: number;
  purchased_at: string;
  image_url: string | null;
}

function BuyerCertificates() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/buyer/certificates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch certificates");

      const data = await response.json();
      setCertificates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimed = (gemId: number, _txHash: string, walletAddress: string) => {
    setCertificates((prev) =>
      prev.map((cert) =>
        cert.gem_id === gemId
          ? { ...cert, nft_claimed: true, nft_owner_address: walletAddress }
          : cert
      )
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <BuyerSidebar
          buyerName={user.full_name || user.email}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 ml-0 md:ml-72 overflow-y-auto">
          {/* Header */}
          <div className="bg-white shadow-sm sticky top-0 z-30">
            <div className="px-6 py-5 md:px-10 md:py-6 flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-2 -ml-2 mr-3 rounded-lg hover:bg-gray-100 text-gray-600 focus:outline-none"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-xl">
                      <Shield className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold">My Certificates</h1>
                      <p className="text-gray-500 text-sm mt-0.5">
                        Blockchain-verified digital certificates for your purchased gems
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {certificates.length > 0 && (
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                  <Gem className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-600">{certificates.length}</span>
                  <span className="text-sm text-gray-400">certificate{certificates.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : certificates.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm mt-10">
                <Shield className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Certificates Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  When you purchase blockchain-verified gems, their immutable digital certificates will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {certificates.map((cert) => (
                  <div key={`${cert.gem_id}-${cert.order_id}`} className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                    {/* Gem Info Header */}
                    <div className="p-6 md:p-8 border-b border-gray-100">
                      <div className="flex flex-col md:flex-row gap-5">
                        {/* Gem Image */}
                        {cert.image_url && (
                          <div className="w-full md:w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                            <img
                              src={cert.image_url}
                              alt={cert.gem_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Gem Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-0.5">{cert.gem_name}</h3>
                              <p className="text-sm text-gray-500">{cert.gem_type}</p>
                            </div>
                            <div className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full">
                              <Shield size={12} />
                              <span className="text-[10px] font-black uppercase tracking-wider">Verified</span>
                            </div>
                          </div>

                          {/* Specs Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Carat</p>
                              <p className="text-[13px] font-semibold text-gray-800">{cert.carat}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Color</p>
                              <p className="text-[13px] font-semibold text-gray-800">{cert.color}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Cut</p>
                              <p className="text-[13px] font-semibold text-gray-800">{cert.cut}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Clarity</p>
                              <p className="text-[13px] font-semibold text-gray-800">{cert.clarity}</p>
                            </div>
                          </div>

                          {/* Meta row */}
                          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3 text-[11px] text-gray-400">
                            <span>Origin: <span className="text-gray-600 font-semibold">{cert.origin}</span></span>
                            <span>Seller: <span className="text-gray-600 font-semibold">{cert.seller_name || cert.business_name}</span></span>
                            <span>NGJA: <span className="text-gray-600 font-mono font-semibold">{cert.ngja_certificate_no}</span></span>
                            {cert.minted_at && (
                              <span>Minted: <span className="text-gray-600 font-semibold">{new Date(cert.minted_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span></span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* GemPassport Section — with Claim button */}
                    <div className="p-6 md:px-8">
                      <GemPassport
                        gem_id={cert.gem_id}
                        gem_name={cert.gem_name}
                        gem_type={cert.gem_type}
                        price={cert.price}
                        carat={cert.carat}
                        cut={cert.cut}
                        clarity={cert.clarity}
                        color={cert.color}
                        origin={cert.origin}
                        mining_region=""
                        description=""
                        ngja_certificate_no={cert.ngja_certificate_no}
                        ngja_certificate_url=""
                        token_id={cert.token_id}
                        tx_hash={cert.tx_hash}
                        blockchain_status={cert.blockchain_status}
                        minted_at={cert.minted_at}
                        verification_status="approved"
                        verified={1}
                        status="Sold"
                        created_at={cert.purchased_at}
                        seller_name={cert.seller_name}
                        seller_id={0}
                        images={cert.image_url ? [cert.image_url] : []}
                        showClaimButton={true}
                        nft_claimed={!!cert.nft_claimed}
                        nft_owner_address={cert.nft_owner_address}
                        onClaimed={(txHash, walletAddress) => handleClaimed(cert.gem_id, txHash, walletAddress)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default BuyerCertificates;
