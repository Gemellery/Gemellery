import type { Seller } from "../types/seller.types";

export const mockSeller: Seller = {
  id: "seller-001",
  name: "Aurelia Stone",
  description:
    "Passionate gemologist and jewellery artisan with over 12 years of experience sourcing ethically mined gems from around the world. Every piece in my collection is hand-selected for its quality, brilliance, and natural beauty. I specialise in rare coloured gemstones and vintage-inspired settings.",
  avatarUrl: "https://i.pravatar.cc/300?img=47",
  bannerUrl:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80",
  location: "Edinburgh, Scotland",
  memberSince: "2021-03-15",
  totalSales: 347,
  responseRate: 98,
  gems: [
    {
      id: "gem-001",
      name: "Alring",
      price: 2450,
      description:
        "A stunning 4.2ct star ruby from Myanmar displaying a perfect six-rayed star. Deep pigeon-blood red with exceptional saturation.",
      imageUrl: "/sample_gems/Alring.jpg",
      category: "Ruby",
      inStock: true,
    },
    {
      id: "gem-002",
      name: "Alexandrite",
      price: 5800,
      description:
        "Rare colour-change alexandrite displaying vivid green in daylight and red-purple tones under incandescent light. A truly magical gemstone.",
      imageUrl: "/sample_gems/alexandrite_18.jpg",
      category: "Alexandrite",
      inStock: true,
    },
    {
      id: "gem-003",
      name: "Almandine Garnet",
      price: 3200,
      description:
        "Deep red almandine garnet with exceptional clarity. A classic and timeless gemstone with rich, velvety colour.",
      imageUrl: "/sample_gems/almandine_18.jpg",
      category: "Garnet",
      inStock: true,
    },
    {
      id: "gem-004",
      name: "Aquamarine",
      price: 4100,
      description:
        "Serene blue aquamarine with excellent transparency. Evokes the calm of the ocean with its beautiful sea-blue hue.",
      imageUrl: "/sample_gems/aquamarine_8.jpg",
      category: "Aquamarine",
      inStock: false,
    },
    {
      id: "gem-005",
      name: "Colombian Emerald",
      price: 6700,
      description:
        "Vivid green Colombian emerald with rich saturation. Minor natural inclusions typical of the finest emeralds from the Muzo mines.",
      imageUrl: "/sample_gems/emerald.png",
      category: "Emerald",
      inStock: true,
    },
    {
      id: "gem-006",
      name: "Royal Blue Ceylon Sapphire",
      price: 1890,
      description:
        "Natural unheated sapphire from Sri Lanka with a stunning royal blue colour. Excellent clarity and brilliant cut.",
      imageUrl: "/sample_gems/gem 3.2ct Royal Blue Ceylon Sapphire.png",
      category: "Sapphire",
      inStock: true,
    },
    {
      id: "gem-007",
      name: "Premium Ruby",
      price: 3800,
      description:
        "A vivid red ruby with exceptional fire and brilliance. Sourced from the finest ruby mines, this stone is a collector's dream.",
      imageUrl: "/sample_gems/ruby.png",
      category: "Ruby",
      inStock: true,
    },
    {
      id: "gem-008",
      name: "Handful Gems Collection",
      price: 9500,
      description:
        "A curated collection of mixed precious gemstones. Each stone individually graded and certified. Perfect for the serious collector.",
      imageUrl: "/sample_gems/handfulgems.jpg",
      category: "Collection",
      inStock: true,
    },
    {
      id: "gem-009",
      name: "Newsletter Special Gem",
      price: 2100,
      description:
        "Exclusive gemstone featured in our newsletter collection. Rare find with outstanding colour saturation and natural brilliance.",
      imageUrl: "/sample_gems/newsletter_gem.jpg",
      category: "Special",
      inStock: false,
    },
  ],
  reviews: [
    {
      id: "rev-001",
      userName: "Margaret H.",
      rating: 5,
      comment:
        "Absolutely breathtaking ruby. The photos don't do it justice — it glows from within. Aurelia was incredibly knowledgeable and patient with all my questions. Would buy again without hesitation.",
      date: "2025-11-20",
      avatarUrl: "https://i.pravatar.cc/100?img=5",
    },
    {
      id: "rev-002",
      userName: "David K.",
      rating: 5,
      comment:
        "The alexandrite I purchased is simply unreal. Every gemologist I've shown it to has been amazed. Fast shipping, beautifully packaged, and came with a full certification.",
      date: "2025-10-08",
      avatarUrl: "https://i.pravatar.cc/100?img=12",
    },
    {
      id: "rev-003",
      userName: "Priya S.",
      rating: 4,
      comment:
        "Lovely sapphire, exactly as described. My only note is that I wish the listing photos showed different lighting conditions. Seller was very responsive and helpful throughout.",
      date: "2025-09-14",
      avatarUrl: "https://i.pravatar.cc/100?img=9",
    },
    {
      id: "rev-004",
      userName: "James T.",
      rating: 5,
      comment:
        "Third purchase from Aurelia and once again she delivers. The emerald is genuinely one of the finest stones I've ever owned. True expertise here.",
      date: "2025-08-29",
      avatarUrl: "https://i.pravatar.cc/100?img=67",
    },
    {
      id: "rev-005",
      userName: "Fiona M.",
      rating: 5,
      comment:
        "Gift for my mother and she cried happy tears. The aquamarine is warm and glowing. Aurelia even included a handwritten note about the stone's origin. Magic.",
      date: "2025-07-11",
      avatarUrl: "https://i.pravatar.cc/100?img=41",
    },
    {
      id: "rev-006",
      userName: "Carlos R.",
      rating: 3,
      comment:
        "The emerald is beautiful but was listed as 'minor inclusions' — I'd say they're a bit more prominent than I expected. Communication was great and Aurelia offered a partial refund.",
      date: "2025-06-22",
      avatarUrl: "https://i.pravatar.cc/100?img=33",
    },
  ],
};