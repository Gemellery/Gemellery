import React from "react";
import { 
  MapPin, 
  Star, 
  MessageSquare, 
  Heart, 
  ShieldCheck, 
  GraduationCap, 
  HandHeart, 
  SlidersHorizontal, 
  ArrowDownUp, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft 
} from "lucide-react";

// --- Configuration & Types ---
interface Gemstone {
  id: number;
  name: string;
  type: string;
  cut: string;
  carat: string;
  treatment: string;
  price: string;
  image: string;
  tag?: string;
}

interface Review {
  id: number;
  text: string;
  author: string;
  location: string;
  rating: number;
  avatar: string;
}

// --- DATA: Updated with new image filenames ---
const gemstones: Gemstone[] = [
  {
    id: 1,
    name: "Royal Blue Ceylon",
    type: "SAPPHIRE",
    cut: "OVAL CUT",
    carat: "2.14 Carats",
    treatment: "Heat Treated",
    price: "$3,450",
    // Updated path
    image: new URL('../assets/brand/Blue Sapphire.png', import.meta.url).href,
  },
  {
    id: 2,
    name: "Pigeon Blood Ruby",
    type: "RUBY",
    cut: "CUSHION",
    carat: "1.05 Carats",
    treatment: "Unheated",
    price: "$8,200",
    // Updated path
    image: new URL('../assets/brand/Ruby.png', import.meta.url).href,
  },
  {
    id: 3,
    name: "Sunset Padparadscha",
    type: "PADPARADSCHA",
    cut: "PEAR",
    carat: "1.8 Carats",
    treatment: "Natural",
    price: "$15,900",
    // Updated path
    image: new URL('../assets/brand/Sunset.png', import.meta.url).href,
    tag: "Rare"
  },
  {
    id: 4,
    name: "Canary Yellow",
    type: "SAPPHIRE",
    cut: "ROUND",
    carat: "3.05 Carats",
    treatment: "VVS1",
    price: "$2,100",
    // Updated path
    image: new URL('../assets/brand/Yellow Sapphire.png', import.meta.url).href,
  }
];

const reviews: Review[] = [
  {
    id: 1,
    text: "The Royal Blue Sapphire I purchased is absolutely stunning. The AI design tool helped me visualize exactly how it would look in a ring setting. Highly recommend Ceylon Sapphires Ltd!",
    author: "Sarah Jenkins",
    location: "London, UK",
    rating: 5,
    // Using placeholder avatar
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: 2,
    text: "Incredible service and transparency. The NGJA certification gave me peace of mind for such a significant purchase. Shipping was secure and fast.",
    author: "Michael Chen",
    location: "Singapore",
    rating: 5,
    // Using placeholder avatar
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: 3,
    text: "Beautiful Padparadscha stone. Color matches the photos exactly. The packaging was luxurious and appropriate for the value of the item.",
    author: "Elena Rodriguez",
    location: "Madrid, Spain",
    rating: 5,
    // Using placeholder avatar
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"
  }
];

// --- COMPONENTS ---

const TrustBadge = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="flex items-start gap-4 p-4 border border-stone-200/60 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow">
    <div className="bg-[#FFF0F0] p-3 rounded-full shrink-0 text-red-500">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="font-bold text-gray-900 text-lg font-serif">{title}</h3>
      <p className="text-gray-500 text-sm mt-1 leading-relaxed font-sans">{desc}</p>
    </div>
  </div>
);

const GemCard = ({ gem }: { gem: Gemstone }) => (
  <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-stone-100 hover:shadow-lg transition-all duration-300 relative group flex flex-col h-full">
    {/* Heart Icon */}
    <div className="absolute top-6 right-6 z-10">
      <button className="p-2.5 rounded-full bg-white text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm border border-gray-100">
        <Heart className="w-5 h-5" />
      </button>
    </div>
    
    {/* Tag */}
    {gem.tag && (
      <span className="absolute top-6 left-6 z-10 bg-gray-900 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
        {gem.tag}
      </span>
    )}

    {/* Image Container */}
    <div className="h-72 w-full bg-[#F9F9F9] rounded-[2rem] flex items-center justify-center mb-5 overflow-hidden relative">
      <img 
        src={gem.image} 
        alt={gem.name} 
        className="w-3/4 h-3/4 object-contain mix-blend-multiply drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500 ease-out" 
      />
    </div>

    {/* Details */}
    <div className="px-2 flex flex-col flex-grow">
      <div className="flex gap-2 text-[10px] font-bold tracking-widest text-red-500 uppercase mb-2 font-sans">
        <span>{gem.type}</span>
        <span>•</span>
        <span>{gem.cut}</span>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-1 font-serif">{gem.name}</h3>
      <p className="text-gray-400 text-sm mb-4 font-sans font-medium">{gem.carat} • {gem.treatment}</p>
      
      <div className="text-2xl font-bold text-gray-900 mb-6 font-sans">{gem.price}</div>
      
      <div className="mt-auto">
        <button className="w-full py-3.5 rounded-2xl btn-ai-gradient text-red-500 flex items-center justify-center gap-2 font-bold text-sm hover:opacity-90 transition-opacity font-sans">
            <Sparkles className="w-4 h-4" />
            Design with AI
        </button>
      </div>
    </div>
  </div>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="bg-[#F9F4EC] p-8 rounded-[2.5rem] flex flex-col justify-between h-full min-h-[320px]">
    <div>
      <div className="flex gap-1 text-red-500 mb-6">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-current" />
        ))}
      </div>
      <p className="text-gray-800 leading-relaxed font-serif text-xl italic">"{review.text}"</p>
    </div>
    
    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-stone-200/50">
      <img src={review.avatar} alt={review.author} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
      <div>
        <h4 className="font-bold text-gray-900 font-sans">{review.author}</h4>
        <p className="text-gray-400 text-xs uppercase tracking-wide font-sans">{review.location}</p>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE LAYOUT ---

export default function BrandPage() {
  return (
    <div className="min-h-screen bg-white pb-32">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-6 py-8 text-xs font-bold tracking-widest text-gray-400 uppercase font-sans">
        <span className="hover:text-red-500 cursor-pointer transition-colors">Home</span>
        <span className="mx-3">/</span>
        <span className="hover:text-red-500 cursor-pointer transition-colors">Sellers</span>
        <span className="mx-3">/</span>
        <span className="text-gray-900">Ceylon Sapphires Ltd</span>
      </div>

      {/* Hero Section Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="bg-[#F9F4EC] rounded-[3rem] p-8 md:p-12 lg:p-16 relative overflow-hidden">
            
            {/* Top Row: Brand Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start gap-10 mb-20 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                    {/* Brand Logo / Avatar - Updated to use Blue Sapphire.png */}
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden shrink-0">
                        <img 
                            src={new URL('../assets/brand/Blue Sapphire.png', import.meta.url).href} 
                            alt="Logo" 
                            className="w-full h-full object-cover scale-150" 
                        />
                    </div>
                    
                    {/* Brand Text Info */}
                    <div className="space-y-3">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">Ceylon Sapphires Ltd</h1>
                        
                        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm font-medium font-sans">
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4 text-red-500" />
                                <span>Ratnapura, Sri Lanka</span>
                            </div>
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-red-500 fill-current" />
                                <span className="text-gray-900 font-bold">4.9</span>
                                <span className="text-gray-500 underline decoration-gray-300 underline-offset-4">(128 Reviews)</span>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <span className="px-4 py-1.5 bg-white rounded-lg text-xs font-bold text-gray-700 border border-stone-200/50 shadow-sm uppercase tracking-wide">
                                NGJA Certified
                            </span>
                            <span className="px-4 py-1.5 bg-white rounded-lg text-xs font-bold text-gray-700 border border-stone-200/50 shadow-sm uppercase tracking-wide">
                                Direct Miner
                            </span>
                        </div>
                    </div>
                </div>

                {/* Hero Actions */}
                <div className="flex gap-4 w-full md:w-auto mt-4 xl:mt-0">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-white rounded-full font-bold text-gray-900 shadow-sm hover:shadow-md transition-all border border-stone-100 font-sans">
                        <MessageSquare className="w-5 h-5" />
                        Contact Seller
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-[#EF4444] text-white rounded-full font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition-all font-sans">
                        <Heart className="w-5 h-5 fill-current" />
                        Follow Brand
                    </button>
                </div>
            </div>

            {/* Bottom Row: About & Trust */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                {/* Text Content */}
                <div className="lg:col-span-7 space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 font-serif">About the Brand</h2>
                    <div className="text-gray-600 space-y-6 text-lg leading-relaxed font-serif">
                        <p>
                        Sourcing ethical sapphires from the mines of Ratnapura for over three generations.
                        We specialize in untreated, natural Corundum ranging from Royal Blue to
                        Padparadscha. All our stones are cut by master lapidarists in-house to ensure
                        maximum brilliance.
                        </p>
                        <p>
                        We believe in complete transparency. Every stone listed comes with a certificate
                        of origin and a detailed history of its journey from mine to market. Our commitment
                        to sustainable mining supports local communities in Sri Lanka.
                        </p>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    <TrustBadge 
                        icon={ShieldCheck} 
                        title="NGJA Certified" 
                        desc="License #88219-A • National Authority Approved" 
                    />
                    <TrustBadge 
                        icon={GraduationCap} 
                        title="GIA Alumnus" 
                        desc="Graduate Gemologist (GG) on staff for grading" 
                    />
                    <TrustBadge 
                        icon={HandHeart} 
                        title="Conflict-Free Source" 
                        desc="Ethically mined with fair labor practices" 
                    />
                </div>
            </div>
        </div>
      </div>

      {/* Gemstones Section */}
      <div className="max-w-[1400px] mx-auto px-6 mt-24 mb-24">
         <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
               <h2 className="text-4xl font-bold text-gray-900 font-serif mb-2">Available Gemstones</h2>
               <p className="text-gray-500 font-sans">Direct from our mines in Ratnapura</p>
            </div>
            
            <div className="flex gap-3">
               <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm font-sans text-sm">
                  <SlidersHorizontal className="w-4 h-4" /> Filter
               </button>
               <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm font-sans text-sm">
                  <ArrowDownUp className="w-4 h-4" /> Sort by
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {gemstones.map(gem => <GemCard key={gem.id} gem={gem} />)}
         </div>

         <div className="mt-16 flex justify-center">
            <button className="flex items-center gap-3 px-10 py-5 bg-white border border-gray-200 rounded-full font-bold text-gray-900 hover:bg-gray-50 shadow-sm transition-all hover:px-12 font-sans">
                View All 42 Stones
                <ArrowRight className="w-5 h-5 text-red-500" />
            </button>
         </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-[1400px] mx-auto px-6">
         <div className="flex justify-between items-end mb-12">
            <div>
               <h2 className="text-4xl font-bold text-gray-900 font-serif mb-3">Customer Reviews</h2>
               <p className="text-red-500 font-medium text-lg font-serif italic">What verified buyers are saying</p>
            </div>
            <div className="flex gap-3">
               <button className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 bg-white transition-colors">
                  <ArrowLeft className="w-6 h-6 text-gray-700" />
               </button>
               <button className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 bg-white transition-colors">
                  <ArrowRight className="w-6 h-6 text-gray-700" />
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
         </div>
      </div>

    </div>
  );
}