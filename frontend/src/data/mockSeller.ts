import { Seller } from "../types/seller.types";

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
      name: "Burmese Star Ruby",
      price: 2450,
      description:
        "A stunning 4.2ct star ruby from Myanmar displaying a perfect six-rayed star. Deep pigeon-blood red with exceptional saturation.",
      imageUrl:
        "https://images.unsplash.com/photo-1611003228941-98852ba62227?w=600&q=80",
      category: "Ruby",
      inStock: true,
    },
    {
      id: "gem-002",
      name: "Paraíba Tourmaline",
      price: 5800,
      description:
        "Rare neon-blue Paraíba tourmaline from Brazil, 2.8ct. The electric turquoise colour is caused by copper and manganese traces.",
      imageUrl:
        "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=600&q=80",
      category: "Tourmaline",
      inStock: true,
    },
    {
      id: "gem-003",
      name: "Ceylon Blue Sapphire",
      price: 3200,
      description:
        "Natural unheated sapphire from Sri Lanka, 3.5ct. Classic cornflower blue with excellent clarity and brilliance.",
      imageUrl:
        "https://images.unsplash.com/photo-1573408301185-9519bf4cc98b?w=600&q=80",
      category: "Sapphire",
      inStock: true,
    },
    {
      id: "gem-004",
      name: "Colombian Emerald",
      price: 4100,
      description:
        "Vivid green Colombian emerald, 2.1ct. Minor natural inclusions typical of the finest emeralds from the Muzo mines.",
      imageUrl:
        "https://images.unsplash.com/photo-1602526212969-4b90a35843ef?w=600&q=80",
      category: "Emerald",
      inStock: false,
    },
    {
      id: "gem-005",
      name: "Alexandrite from Russia",
      price: 6700,
      description:
        "Rare colour-change alexandrite from the Ural Mountains, 1.4ct. Green in daylight, red-purple under incandescent light.",
      imageUrl:
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80",
      category: "Alexandrite",
      inStock: true,
    },
    {
      id: "gem-006",
      name: "Imperial Topaz",
      price: 1890,
      description:
        "Golden-orange imperial topaz from Ouro Preto, Brazil. 5.6ct oval cut with warm peachy-orange hues.",
      imageUrl:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
      category: "Topaz",
      inStock: true,
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
        "The Paraíba tourmaline I purchased is simply unreal. Every gemologist I've shown it to has been amazed. Fast shipping, beautifully packaged, and came with a full certification.",
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
        "Third purchase from Aurelia and once again she delivers. The alexandrite is genuinely one of the finest colour-change stones I've ever owned. True expertise here.",
      date: "2025-08-29",
      avatarUrl: "https://i.pravatar.cc/100?img=67",
    },
    {
      id: "rev-005",
      userName: "Fiona M.",
      rating: 5,
      comment:
        "Gift for my mother and she cried happy tears. The imperial topaz is warm and glowing. Aurelia even included a handwritten note about the stone's origin. Magic.",
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