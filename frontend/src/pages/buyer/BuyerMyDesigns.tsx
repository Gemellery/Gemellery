import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyerSidebar from "../../components/BuyerSidebar";
import Footer from "../../components/BasicFooter";
import { Menu, Plus, Wand2, ArrowRight } from "lucide-react";
import { getUserDesigns } from "../../lib/jewelry-designer/api";
import type { JewelryDesign } from "../../lib/jewelry-designer/types";

function BuyerMyDesigns() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [designs, setDesigns] = useState<JewelryDesign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUserDesigns()
      .then((data) =>
        setDesigns(
          data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        )
      )
      .catch(() => setDesigns([]))
      .finally(() => setLoading(false));
  }, []);

  // Group by date label
  const groupByDate = (designs: JewelryDesign[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    const weekAgo = new Date(today.getTime() - 7 * 86400000);

    const groups: { label: string; items: JewelryDesign[] }[] = [
      { label: "Today", items: [] },
      { label: "Yesterday", items: [] },
      { label: "This Week", items: [] },
      { label: "Older", items: [] },
    ];

    designs.forEach((d) => {
      const date = new Date(d.createdAt);
      if (date >= today) groups[0].items.push(d);
      else if (date >= yesterday) groups[1].items.push(d);
      else if (date >= weekAgo) groups[2].items.push(d);
      else groups[3].items.push(d);
    });

    return groups.filter((g) => g.items.length > 0);
  };

  const groups = groupByDate(designs);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-800">
      <BuyerSidebar
        buyerName={user.full_name || user.email}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto">

        {/* Sticky Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-8 md:px-10 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100/80 text-gray-600 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h3 className="font-bold text-2xl tracking-tight text-gray-900">
                My Designs
              </h3>
              <p className="text-gray-500 mt-1">
                Your AI-generated jewelry design history.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/jewelry-designer")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#cc000b] text-white font-medium rounded-xl shadow-lg shadow-red-500/20 hover:bg-[#aa0009] hover:-translate-y-0.5 transition-all duration-300 w-full md:w-auto"
          >
            <Plus size={18} />
            <span className="hidden md:inline">New AI Design</span>
            <span className="md:hidden">New Design</span>
          </button>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-2 animate-pulse shadow-sm">
                  <div className="aspect-square bg-gray-100 rounded-xl mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mx-1" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 mx-1 mt-2" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && designs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                <Wand2 className="w-8 h-8 text-[#cc000b]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No designs yet</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-xs">
                You haven't created any AI jewelry designs yet. Start your first one now.
              </p>
              <button
                onClick={() => navigate("/jewelry-designer")}
                className="flex items-center gap-2 px-6 py-3 bg-[#cc000b] text-white font-medium rounded-xl shadow-lg shadow-red-500/20 hover:bg-[#aa0009] transition-all"
              >
                <Plus size={18} /> Create Your First Design
              </button>
            </div>
          )}

          {/* Grouped design sections */}
          {!loading && groups.map(({ label, items }) => (
            <section key={label}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-gray-900">{label}</h3>
                <span className="text-xs text-gray-400 font-medium">{items.length} design{items.length !== 1 ? "s" : ""}</span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {items.map((design) => {
                  const thumb =
                    design.generatedImages?.[0]?.thumbnailUrl ||
                    design.generatedImages?.[0]?.url ||
                    null;

                  return (
                    <div
                      key={design.id}
                      onClick={() => navigate(`/jewelry-designer/design/${design.id}`)}
                      className="bg-white rounded-2xl border border-gray-100 p-2 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col"
                    >
                      {/* Thumbnail */}
                      <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden relative flex-shrink-0">
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10" />
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={`${design.gemType} ${design.gemCut}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Wand2 className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                        {/* Gem type badge */}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase text-gray-600 shadow-sm z-20">
                          {design.gemType || "Design"}
                        </div>
                        {/* Arrow */}
                        <div className="absolute bottom-3 right-3 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <ArrowRight className="w-3.5 h-3.5 text-gray-700" />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="px-1 pt-2 pb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#cc000b] transition-colors">
                          {design.gemType} {design.gemCut}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {design.designPrompt?.slice(0, 50) || "—"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 py-1">
                          {new Date(design.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <Footer />
      </main>
    </div>
  );
}

export default BuyerMyDesigns;
