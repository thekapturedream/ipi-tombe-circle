export type MakerCategory = "Art" | "Home" | "Wear" | "Wellbeing";

export type Maker = {
  id: string;
  stall: number;
  brand: string;
  makers: string[];
  category: MakerCategory;
  craft: string;
  description: string;
  email: string[];
  phone: string[];
  images: string[];
  featured?: boolean;
  status: "Published" | "Needs copy" | "Needs photos";
};

export const makers: Maker[] = [
  {
    id: "chris-frames",
    stall: 1,
    brand: "Chris Frames",
    makers: ["Christopher Tenisi"],
    category: "Art",
    craft: "Frames & framing",
    description:
      "Thoughtful framing for art, photographs and the pieces that hold a family story.",
    email: ["christenisi2@gmail.com"],
    phone: ["+263 77 301 9440"],
    images: ["/media/makers/chris-frames/chris-frames-3030.jpg"],
    status: "Published",
  },
  {
    id: "kd-poratoe",
    stall: 2,
    brand: "KD Poratoe",
    makers: ["Kudakwashe Samu"],
    category: "Home",
    craft: "Zimbabwean textiles",
    description:
      "Zimbabwean fabrics transformed into expressive runners, cushion covers, bags and tablecloths.",
    email: [],
    phone: ["+263 78 360 7442"],
    images: [
      "/media/makers/kd-poratoe/kd-poratoe-3026.jpg",
      "/media/makers/kd-poratoe/kd-poratoe-3024.jpg",
      "/media/makers/kd-poratoe/kd-poratoe-3027.jpg",
    ],
    featured: true,
    status: "Published",
  },
  {
    id: "once-upon-a-time",
    stall: 3,
    brand: "Once Upon A Time",
    makers: ["Ishmael Marimirofa"],
    category: "Art",
    craft: "Upcycled & sustainable art",
    description:
      "Imaginative visual art that gives discarded materials an unexpected second life.",
    email: ["marimirofa.ish@gmail.com"],
    phone: ["+263 77 226 6146"],
    images: [
      "/media/makers/once-upon-a-time/once-upon-a-time-3127.jpg",
    ],
    status: "Needs copy",
  },
  {
    id: "brendas-exquisite-crochets",
    stall: 4,
    brand: "Brendas Exquisite Crochets",
    makers: ["Brenda Chigodora"],
    category: "Wear",
    craft: "Crochet, clothing & accessories",
    description:
      "Crocheted baskets, upcycled denim, tops, scarves, ponchos, hats, jewellery, flowers and joyful small details.",
    email: ["pamhiebrenda@gmail.com"],
    phone: ["+27 74 377 1403"],
    images: [
      "/media/makers/brendas-exquisite-crochets/brendas-exquisite-crochets-3040.jpg",
      "/media/makers/brendas-exquisite-crochets/brendas-exquisite-crochets-3038.jpg",
      "/media/makers/brendas-exquisite-crochets/brendas-exquisite-crochets-3042.jpg",
    ],
    featured: true,
    status: "Published",
  },
  {
    id: "pretty-knotted",
    stall: 7,
    brand: "Pretty Knotted",
    makers: ["Bev Dalton"],
    category: "Home",
    craft: "Macramé",
    description:
      "Intricate hand-knotted macramé made to bring softness, texture and soul into a space.",
    email: ["prettyknottedzw@gmail.com"],
    phone: ["+263 77 769 968"],
    images: [],
    status: "Needs photos",
  },
  {
    id: "humble-hides",
    stall: 8,
    brand: "Humble Hides",
    makers: ["Christie Emmanuel"],
    category: "Wear",
    craft: "Leather goods",
    description:
      "Useful, enduring leather pieces shaped by hand and designed to grow richer with time.",
    email: ["cemmanuel@humblehides.com"],
    phone: ["+263 77 225 2808"],
    images: ["/media/makers/humble-hides/humble-hides-3131.jpg"],
    status: "Published",
  },
  {
    id: "lwiindi-group",
    stall: 9,
    brand: "Lwiindi Group",
    makers: ["Iriner “Irene” Mudimba"],
    category: "Home",
    craft: "Binga baskets",
    description:
      "Handwoven Binga baskets with sculptural form, natural rhythm and deep cultural memory.",
    email: [],
    phone: ["+263 77 965 0745"],
    images: ["/media/makers/lwiindi-group/lwiindi-group-3035.jpg"],
    featured: true,
    status: "Published",
  },
  {
    id: "back-to-earth",
    stall: 10,
    brand: "Back to Earth",
    makers: ["Cindy Mommsen"],
    category: "Wellbeing",
    craft: "Natural skincare",
    description:
      "Handcrafted skincare made with care, research and purpose. Every recipe is Cindy’s own, developed to nourish the skin with natural, considered ingredients.",
    email: ["cindyltm@gmail.com"],
    phone: ["+263 77 226 4470"],
    images: [
      "/media/makers/back-to-earth/back-to-earth-3138.jpg",
      "/media/makers/back-to-earth/back-to-earth-3137.jpg",
      "/media/makers/back-to-earth/back-to-earth-3139.jpg",
    ],
    featured: true,
    status: "Published",
  },
  {
    id: "glass-precisions",
    stall: 11,
    brand: "Glass Precisions Gift Shop",
    makers: ["Monica Simba", "Norbert Mpofu"],
    category: "Home",
    craft: "Frosted glassware",
    description:
      "Elegant frosted glassware that turns familiar objects into personal, gift-worthy keepsakes.",
    email: ["monicasimba736@gmail.com"],
    phone: ["+263 77 122 0247"],
    images: [
      "/media/makers/glass-precisions/glass-precisions-3047.jpg",
      "/media/makers/glass-precisions/glass-precisions-3051.jpg",
      "/media/makers/glass-precisions/glass-precisions-3046.jpg",
    ],
    featured: true,
    status: "Published",
  },
  {
    id: "takita",
    stall: 12,
    brand: "Takita",
    makers: ["Tana Walsh", "Kimball Groves", "Tanja Komen"],
    category: "Wear",
    craft: "Designer clothing & accessories",
    description:
      "An exclusive collection of handmade clothing, accessories and authentic crocodile pieces by three Zimbabwean designers.",
    email: [
      "tanaafricaofficial@gmail.com",
      "kimbillg@gmail.com",
      "tanjkomen@gmail.com",
    ],
    phone: ["+263 71 993 3288", "+263 78 062 4145", "+263 77 257 0667"],
    images: [],
    status: "Needs photos",
  },
  {
    id: "two-zebra",
    stall: 13,
    brand: "Two Zebra",
    makers: ["Trymore Madiziyao"],
    category: "Art",
    craft: "Recycled aluminium",
    description:
      "Characterful sculptural work shaped from recycled aluminium—resourceful, playful and distinctly local.",
    email: ["twozebratwo@gmail.com"],
    phone: ["+263 77 632 4360"],
    images: [
      "/media/makers/two-zebra/two-zebra-3032.jpg",
      "/media/makers/two-zebra/two-zebra-3033.jpg",
    ],
    status: "Published",
  },
  {
    id: "silver-cee",
    stall: 14,
    brand: "Silver Cee",
    makers: ["Sylvester Chiduwa"],
    category: "Home",
    craft: "Mirrors, frames & furniture",
    description:
      "Pressed-ceiling frames, mirrors and statement furniture that give heritage pattern a new setting.",
    email: ["sylvesterchiduwa16@gmail.com"],
    phone: ["+263 77 870 0602"],
    images: [
      "/media/makers/silver-cee/silver-cee-3055.jpg",
      "/media/makers/silver-cee/silver-cee-3056.jpg",
      "/media/makers/silver-cee/silver-cee-3054.jpg",
    ],
    status: "Published",
  },
  {
    id: "emo-brew-vibe-merch",
    stall: 15,
    brand: "Emo Brew Vibe Merch",
    makers: ["Memory Muguyo"],
    category: "Wear",
    craft: "Creative accessories & wear",
    description:
      "Handmade Zimbabwean accessories and wearable pieces carrying colour, identity and everyday energy.",
    email: ["mmuguyo@gmail.com"],
    phone: ["+263 78 221 2460"],
    images: [
      "/media/makers/emo-brew-vibe-merch/emo-brew-vibe-merch-3058.jpg",
      "/media/makers/emo-brew-vibe-merch/emo-brew-vibe-merch-3060.jpg",
    ],
    status: "Needs copy",
  },
  {
    id: "highlands-trading",
    stall: 16,
    brand: "Highlands Trading",
    makers: ["Hugh Tyser"],
    category: "Home",
    craft: "Ceramics",
    description:
      "Quietly expressive ceramics with honest materials, tactile surfaces and enduring form.",
    email: ["tyser.hugh@gmail.com"],
    phone: ["+263 78 500 1200"],
    images: [
      "/media/makers/highlands-trading/highlands-trading-3044.jpg",
      "/media/makers/highlands-trading/highlands-trading-3043.jpg",
      "/media/makers/highlands-trading/highlands-trading-3045.jpg",
    ],
    featured: true,
    status: "Published",
  },
  {
    id: "anemone",
    stall: 17,
    brand: "Anemone",
    makers: ["Emma French"],
    category: "Home",
    craft: "Linen, stationery & original print",
    description:
      "Original designs across fabric and paper: runners, cushions, bags, scarves, table linen, apparel and thoughtful gifts.",
    email: ["efrenchfries@gmail.com", "emma@anemone-africa.com"],
    phone: ["+263 77 224 8380"],
    images: [],
    status: "Needs photos",
  },
  {
    id: "wooden-wonders-sunflower-treasures",
    stall: 18,
    brand: "Wooden Wonders & Sunflower Treasures",
    makers: ["Emily Myburgh", "Androniki Hiripis"],
    category: "Home",
    craft: "Children’s woodcraft & personalised gifts",
    description:
      "Children’s wooden craft and furniture alongside personalised handcrafted photo boards and accessories.",
    email: ["andronikihiripis@gmail.com", "sunflowertreasures1@gmail.com"],
    phone: ["+263 77 555 2880", "+263 77 236 7603"],
    images: [
      "/media/makers/wooden-wonders-sunflower-treasures/wooden-wonders-sunflower-treasures-3079.jpg",
      "/media/makers/wooden-wonders-sunflower-treasures/wooden-wonders-sunflower-treasures-3065.jpg",
      "/media/makers/wooden-wonders-sunflower-treasures/wooden-wonders-sunflower-treasures-3083.jpg",
    ],
    featured: true,
    status: "Published",
  },
  {
    id: "fineweave",
    stall: 19,
    brand: "Fineweave",
    makers: ["Abraham Chikosho"],
    category: "Home",
    craft: "Woven rugs",
    description:
      "Richly textured woven rugs and home pieces composed through colour, repetition and patient handwork.",
    email: ["fineweave544@gmail.com"],
    phone: ["+263 77 273 5244"],
    images: [
      "/media/makers/fineweave/fineweave-3133.jpg",
      "/media/makers/fineweave/fineweave-3132.jpg",
      "/media/makers/fineweave/fineweave-3134.jpg",
    ],
    featured: true,
    status: "Published",
  },
  {
    id: "kudzie-mobile-art-gallery",
    stall: 20,
    brand: "Kudzie Mobile Art Gallery",
    makers: ["Charles Kudzai Katsina “Soda”"],
    category: "Art",
    craft: "Paintings, art wear & grater plates",
    description:
      "A roaming world of paintings, canvases, art on T-shirts and handmade grater plates by Soda Artist.",
    email: ["sodakudzai899@gmail.com"],
    phone: ["+263 77 919 0807"],
    images: [
      "/media/makers/kudzie-mobile-art-gallery/kudzie-mobile-art-gallery-3112.jpg",
      "/media/makers/kudzie-mobile-art-gallery/kudzie-mobile-art-gallery-3123.jpg",
      "/media/makers/kudzie-mobile-art-gallery/kudzie-mobile-art-gallery-3107.jpg",
      "/media/makers/kudzie-mobile-art-gallery/kudzie-mobile-art-gallery-3092.jpg",
    ],
    featured: true,
    status: "Published",
  },
];

export const sharedSpaces = [
  {
    stall: 5,
    title: "Shared exhibition space",
    description: "A larger communal stall reserved for revolving artists.",
  },
  {
    stall: 6,
    title: "Shared exhibition space",
    description: "A flexible space for exhibitions, collaborations and new voices.",
  },
];

export const makerCategories: Array<"All" | MakerCategory> = [
  "All",
  "Art",
  "Home",
  "Wear",
  "Wellbeing",
];
