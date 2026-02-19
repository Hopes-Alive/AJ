import { Category, Stat, Service, Milestone, Brand } from "@/types";

export const categories: Category[] = [
  {
    id: "beverages",
    name: "Beverages",
    description: "Fruit juices, coconut drinks, basil seeds, energy drinks, and more.",
    icon: "glass-water",
    groups: [
      {
        id: "aj-fruit-juice",
        name: "AJ Fruit Juice Range",
        features: "Fruit-flavoured canned juices, retail-ready cartons, suitable for convenience stores and wholesalers.",
        defaultPack: "24 × 320 ml",
        defaultPrice: "$24.00 + GST",
        products: [
          { name: "Mango Juice" },
          { name: "Orange Juice" },
          { name: "Guava Juice" },
          { name: "Lychee Juice" },
          { name: "Strawberry Juice" },
          { name: "Pomegranate Juice" },
          { name: "Apple Juice" },
        ],
      },
      {
        id: "coconut-milk",
        name: "AJ Coconut Milk Drinks",
        features: "Flavoured coconut milk beverages, premium bottle packaging.",
        defaultPack: "24 × 290 ml",
        defaultPrice: "$33.00 + GST",
        products: [
          { name: "Original Coconut Milk" },
          { name: "Lychee Coconut Milk" },
          { name: "Banana Coconut Milk" },
          { name: "Strawberry Coconut Milk" },
          { name: "Vanilla Coconut Milk" },
          { name: "Pomegranate Coconut Milk" },
          { name: "Cocktail Coconut Milk" },
          { name: "Pineapple Coconut Milk" },
          { name: "Passionfruit Coconut Milk" },
          { name: "Mango Coconut Milk" },
        ],
      },
      {
        id: "coconut-water",
        name: "AJ Coconut Water Range",
        features: "Natural coconut hydration drinks, multiple sizes.",
        products: [
          { name: "Coconut Water", pack: "24 × 320 ml", price: "$30.00" },
          { name: "Coconut Water", pack: "24 × 490 ml", price: "$38.00" },
          { name: "Coconut Water", pack: "12 × 1 L", price: "$30.00" },
          { name: "Coconut Water", pack: "12 × 1.25 L", price: "$36.00" },
          { name: "Watermelon Coconut Water", pack: "24 × 490 ml", price: "$38.00 + GST" },
          { name: "Passionfruit Coconut Water", pack: "24 × 490 ml", price: "$38.00 + GST" },
        ],
      },
      {
        id: "basil-seed",
        name: "Basil Seed Drinks",
        features: "Drinks with basil seeds for texture and health appeal.",
        defaultPack: "24 × 290 ml",
        defaultPrice: "$24.00 + GST",
        products: [
          { name: "Strawberry" },
          { name: "Pomegranate" },
          { name: "Watermelon" },
          { name: "Mango" },
          { name: "Cocktail" },
          { name: "Orange" },
          { name: "Guava" },
          { name: "Peach" },
          { name: "Passionfruit" },
          { name: "Raspberry" },
          { name: "Lychee" },
          { name: "Blueberry" },
          { name: "Pineapple" },
        ],
      },
      {
        id: "coco-queen",
        name: "Coco Queen Drinks",
        features: "Fruit-flavoured drinks in premium plastic bottles.",
        defaultPack: "24 × 320 ml",
        defaultPrice: "$29.00 + GST",
        products: [
          { name: "Strawberry" },
          { name: "Blue Raspberry" },
          { name: "Melon" },
          { name: "Pineapple" },
          { name: "Lychee" },
          { name: "Mango" },
          { name: "Watermelon" },
          { name: "Grape" },
          { name: "Orange" },
        ],
      },
      {
        id: "okf-aloe",
        name: "OKF Aloe Drinks",
        features: "Premium aloe vera beverages in multiple sizes.",
        products: [
          { name: "Original (Large)", pack: "12 × 1.5 L", price: "$28.00 + GST" },
          { name: "Peach (Large)", pack: "12 × 1.5 L", price: "$28.00 + GST" },
          { name: "Mango (Large)", pack: "12 × 1.5 L", price: "$28.00 + GST" },
          { name: "Pomegranate (Large)", pack: "12 × 1.5 L", price: "$28.00 + GST" },
          { name: "Mango (Medium)", pack: "20 × 500 ml", price: "$28.00 + GST" },
          { name: "Pineapple (Medium)", pack: "20 × 500 ml", price: "$28.00 + GST" },
          { name: "Pomegranate (Medium)", pack: "20 × 500 ml", price: "$28.00 + GST" },
          { name: "Strawberry (Medium)", pack: "20 × 500 ml", price: "$28.00 + GST" },
          { name: "Original (Medium)", pack: "20 × 500 ml", price: "$28.00 + GST" },
        ],
      },
      {
        id: "soft-energy",
        name: "Soft Drinks & Energy Drinks",
        features: "Popular carbonated and energy beverages.",
        products: [
          { name: "AJ Cola", pack: "24 × 320 ml", price: "$16.00 + GST" },
          { name: "7UP", pack: "24 × 320 ml", price: "$24.00 + GST" },
          { name: "Fanta Orange", pack: "24 × 320 ml", price: "$24.00 + GST" },
          { name: "Fanta Strawberry", pack: "24 × 320 ml", price: "$24.00 + GST" },
          { name: "Fanta Grape", pack: "24 × 320 ml", price: "$24.00 + GST" },
          { name: "Mountain Dew", pack: "24 × 320 ml", price: "$24.00 + GST" },
          { name: "Coca-Cola", pack: "6 × 4-pack × 320 ml", price: "$24.00 + GST" },
          { name: "Red Bull", pack: "24 × 250 ml", price: "$33.00 + GST" },
          { name: "Ginseng Energy Drink", pack: "24 × 250 ml", price: "$38.00 + GST" },
        ],
      },
    ],
  },
  {
    id: "coffee-honey",
    name: "Coffee & Honey",
    description: "Premium coffee products and natural honey.",
    icon: "coffee",
    groups: [
      {
        id: "coffee",
        name: "Coffee Products",
        products: [
          { name: "Nescafe Classic Jar", pack: "12 × 200 g", price: "$138.00 + GST" },
          { name: "Nescafe 3-in-1", pack: "24 × 25 × 18 g", price: "$148.60 + GST" },
          { name: "Coffee Mate", pack: "12 × 1 kg", price: "$95.80 + GST" },
        ],
      },
      {
        id: "honey",
        name: "Honey",
        products: [
          { name: "Asal Honey", pack: "12 × 1 kg", price: "$192.00 + GST" },
        ],
      },
    ],
  },
  {
    id: "tea",
    name: "Tea",
    description: "Premium green tea in various formats and sizes.",
    icon: "leaf",
    groups: [
      {
        id: "green-tea",
        name: "AJ Green Tea",
        products: [
          { name: "Green Tea Teabag", pack: "24 × 200 g", price: "$120.00" },
          { name: "Green Tea Loose", pack: "24 × 500 g", price: "$132.00" },
          { name: "Green Tea Jar (800g)", pack: "8 × 800 g", price: "$80.00" },
          { name: "Green Tea Jar (500g)", pack: "12 × 500 g", price: "$66.00" },
        ],
      },
    ],
  },
  {
    id: "dried-fruits-nuts",
    name: "Dried Fruits & Nuts",
    description: "Premium dried fruits, berries, and roasted nuts.",
    icon: "cherry",
    groups: [
      {
        id: "dried-fruits-nuts-main",
        name: "Dried Fruits & Nuts",
        products: [
          { name: "Dried Sweet Apricot", pack: "14 × 700 g", price: "$98.00" },
          { name: "Dried Sour Apricot", pack: "14 × 700 g" },
          { name: "Dried Black Mulberry", pack: "14 × 700 g", price: "$98.00" },
          { name: "Dried White Mulberry", pack: "12 × 700 g", price: "$120.00" },
          { name: "Green Sultana", pack: "15 × 700 g", price: "$105.00" },
          { name: "Australian Almond", pack: "15 × 700 g" },
          { name: "AJ Walnuts", pack: "10 × 700 g" },
          { name: "Salted Roasted Cashew", pack: "12 × 700 g", price: "$168.00" },
          { name: "Unsalted Roasted Cashew", pack: "12 × 700 g", price: "$168.00" },
        ],
      },
    ],
  },
  {
    id: "rice",
    name: "Rice",
    description: "Premium basmati and daily-use rice varieties.",
    icon: "wheat",
    groups: [
      {
        id: "soneri-rice",
        name: "Soneri Rice Range",
        products: [
          { name: "Soneri Daily Use Rice", pack: "4 × 5 kg", price: "$52.00" },
          { name: "Soneri Basmati Super Kernel", pack: "4 × 5 kg", price: "$64.00" },
          { name: "Soneri Premium Basmati", pack: "4 × 5 kg", price: "$64.00" },
          { name: "Soneri Golden Sella", pack: "4 × 5 kg", price: "$64.00" },
        ],
      },
    ],
  },
  {
    id: "charcoal",
    name: "Charcoal",
    description: "Natural wood charcoal and shisha charcoal products.",
    icon: "flame",
    groups: [
      {
        id: "charcoal-main",
        name: "Charcoal Products",
        products: [
          { name: "10 kg Charcoal Bag", price: "$17.00 + GST" },
          { name: "5 kg Charcoal Bag", price: "$8.50 + GST" },
          { name: "10 kg Charcoal Box", price: "$19.00 + GST" },
          { name: "10 × 1 kg Shisha Charcoal Box", price: "$50.00 + GST" },
          { name: "10 kg AJ Wood Charcoal", price: "$17.00 + GST" },
        ],
      },
    ],
  },
  {
    id: "harris-juice",
    name: "Harris Juice",
    description: "Harris premium fruit juice range in large bottles.",
    icon: "citrus",
    groups: [
      {
        id: "harris-main",
        name: "Harris Juice Range",
        products: [
          { name: "Harris Mango Juice", pack: "6 × 2 L", price: "$24.00 + GST" },
          { name: "Harris Guava Juice", pack: "6 × 2 L", price: "$24.00 + GST" },
          { name: "Harris Mango Juice", pack: "12 × 1 L", price: "$24.00 + GST" },
          { name: "Harris Pink Guava", pack: "12 × 1 L", price: "$24.00 + GST" },
          { name: "Harris White Guava", pack: "12 × 1 L", price: "$24.00 + GST" },
          { name: "Harris Tropical Juice", pack: "12 × 1 L", price: "$24.00 + GST" },
        ],
      },
    ],
  },
  {
    id: "noodles",
    name: "Noodles",
    description: "Indomie, Maggi, and other popular instant noodle brands.",
    icon: "soup",
    groups: [
      {
        id: "noodles-main",
        name: "Instant Noodles",
        products: [
          { name: "Indomie 40 Pack Box", pack: "40 × 85 g", price: "$15.00" },
          { name: "Indomie 5 Pack", pack: "8 × 5 × 85 g", price: "$17.00" },
          { name: "Indomie 10 Pack", pack: "6 × 10 × 85 g", price: "$29.00" },
          { name: "Indomie Hot & Spicy", pack: "8 × 5 × 80 g", price: "$23.00" },
          { name: "Indomie Spicy Gourmet", pack: "8 × 5 × 80 g" },
          { name: "Maggi Kari (Curry)", pack: "12 × 5 × 79 g" },
          { name: "Maggi Ayam (Chicken)", pack: "12 × 5 × 77 g", price: "$33.00" },
          { name: "Maggi Tom Yam", pack: "12 × 5 × 80 g", price: "$33.00" },
        ],
      },
    ],
  },
  {
    id: "shan-masala",
    name: "Shan Masala",
    description: "Authentic Shan spice mixes for a wide variety of dishes.",
    icon: "chef-hat",
    groups: [
      {
        id: "shan-main",
        name: "Shan Masala Range",
        features: "Approximately 48 packs per carton — $69.60 per carton.",
        defaultPrice: "$69.60/carton",
        products: [
          { name: "Biryani" },
          { name: "Butter Chicken" },
          { name: "Chicken Handi" },
          { name: "Hunter Beef" },
          { name: "Fried Fish" },
          { name: "Seekh Kabab" },
          { name: "Nihari" },
          { name: "Korma" },
          { name: "Kofta" },
          { name: "Pav Bhaji" },
          { name: "Karachi Beef Biryani" },
          { name: "Vegetable Masala" },
          { name: "Curry Powder" },
          { name: "Chicken Tikka" },
          { name: "Sindhi Biryani" },
          { name: "Tikka Seekh Kabab" },
        ],
      },
    ],
  },
  {
    id: "candies",
    name: "Candies",
    description: "Popular candy brands including Kopiko, Mentos, and more.",
    icon: "candy",
    groups: [
      {
        id: "candies-main",
        name: "Candy & Confectionery",
        products: [
          { name: "Kopiko Coffee Candy", pack: "24 × 50 pcs (175 g)", price: "$36.00 + GST" },
          { name: "Kopiko Cappuccino Candy", pack: "24 × 50 pcs", price: "$36.00 + GST" },
          { name: "Mentos Pouch Mint", price: "$40.00 + GST" },
          { name: "Mentos Pouch Fruity", price: "$40.00 + GST" },
          { name: "Mentos Mix Fruit", price: "$40.00 + GST" },
          { name: "I-Pop", price: "$30.00 + GST" },
        ],
      },
    ],
  },
  {
    id: "salt-onion",
    name: "Salt & Fried Onion",
    description: "Himalayan salt and premium fried onion products.",
    icon: "droplets",
    groups: [
      {
        id: "salt-onion-main",
        name: "Salt & Fried Onion",
        products: [
          { name: "Soneri Himalayan Salt", pack: "12 × 1 kg", price: "$24.00 + GST" },
          { name: "Salina Salt", pack: "12 × 1.5 kg", price: "$30.00 + GST" },
          { name: "Haaris Fried Onion 1 kg", pack: "10 × 1 kg", price: "$60.00 + GST" },
          { name: "Haaris Fried Onion 400 g", pack: "24 × 400 g", price: "$60.00 + GST" },
        ],
      },
    ],
  },
  {
    id: "household",
    name: "Household Goods",
    description: "Essential household items for retail.",
    icon: "home",
    groups: [
      {
        id: "household-main",
        name: "Household Products",
        products: [
          { name: "Disposable Tablecloth Roll", pack: "12 pcs per box", price: "$120.00" },
        ],
      },
    ],
  },
];

export const companyStats: Stat[] = [
  { value: "130+", label: "Products" },
  { value: "12", label: "Categories" },
  { value: "Wholesale", label: "Pricing" },
  { value: "Australia", label: "Wide Delivery" },
];

export const featuredBrands: Brand[] = [
  { name: "Coca-Cola", logo: "/images/brands/coca-cola.png" },
  { name: "Nescafe", logo: "/images/brands/nescafe.png" },
  { name: "Indomie", logo: "/images/brands/indomie.png" },
  { name: "Shan", logo: "/images/brands/shan.png" },
  { name: "OKF", logo: "/images/brands/okf.jpg" },
  { name: "Red Bull", logo: "/images/brands/red-bull.png" },
  { name: "Soneri" },
];

export const services: Service[] = [
  {
    title: "Warehouse & Storage",
    description:
      "Temperature-controlled warehousing facilities ensuring product freshness and quality from receipt to dispatch.",
    icon: "warehouse",
  },
  {
    title: "Route Delivery",
    description:
      "Scheduled delivery routes across Australia, with reliable on-time performance to keep your shelves stocked.",
    icon: "truck",
  },
  {
    title: "Order Management",
    description:
      "Streamlined ordering process with dedicated support, flexible order sizes, and competitive wholesale pricing.",
    icon: "clipboard",
  },
  {
    title: "Retail Support",
    description:
      "In-store merchandising assistance to help optimise product placement, shelf layouts, and promotional displays.",
    icon: "store",
  },
];

export const milestones: Milestone[] = [
  {
    year: "Founded",
    title: "AJ Fresh Foods Established",
    description:
      "Started with a vision to bring quality, affordable grocery products to retailers across Australia.",
  },
  {
    year: "Growth",
    title: "Product Range Expansion",
    description:
      "Expanded to 12 product categories including beverages, spices, rice, noodles, and household goods.",
  },
  {
    year: "Scale",
    title: "130+ Products",
    description:
      "Built a comprehensive catalogue of over 130 products sourced from trusted brands worldwide.",
  },
  {
    year: "Today",
    title: "Australia-Wide Distribution",
    description:
      "Serving retailers and supermarkets across Australia with reliable wholesale distribution.",
  },
];
