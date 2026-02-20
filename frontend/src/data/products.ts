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
          { name: "Mango Juice", image: "/images/products/mango-juice.png" },
          { name: "Orange Juice", image: "/images/products/orange-juice.png" },
          { name: "Guava Juice", image: "/images/products/guava-juice.png" },
          { name: "Lychee Juice", image: "/images/products/lychee-juice.png" },
          { name: "Strawberry Juice", image: "/images/products/strawberry-juice.png" },
          { name: "Pomegranate Juice", image: "/images/products/pomegranate-juice.png" },
          { name: "Apple Juice", image: "/images/products/apple-juice.png" },
        ],
      },
      {
        id: "coconut-milk",
        name: "AJ Coconut Milk Drinks",
        features: "Flavoured coconut milk beverages, premium bottle packaging.",
        defaultPack: "24 × 290 ml",
        defaultPrice: "$33.00 + GST",
        products: [
          { name: "Original Coconut Milk", image: "/images/products/original-coconut-milk.png" },
          { name: "Lychee Coconut Milk", image: "/images/products/lychee-coconut-milk.png" },
          { name: "Banana Coconut Milk", image: "/images/products/banana-coconut-milk.png" },
          { name: "Strawberry Coconut Milk", image: "/images/products/strawberry-coconut-milk.png" },
          { name: "Vanilla Coconut Milk", image: "/images/products/vanilla-coconut-milk.png" },
          { name: "Pomegranate Coconut Milk", image: "/images/products/pomegranate-coconut-milk.png" },
          { name: "Cocktail Coconut Milk", image: "/images/products/cocktail-coconut-milk.png" },
          { name: "Pineapple Coconut Milk", image: "/images/products/pineapple-coconut-milk.png" },
          { name: "Passionfruit Coconut Milk", image: "/images/products/passionfruit-coconut-milk.png" },
          { name: "Mango Coconut Milk", image: "/images/products/mango-coconut-milk.png" },
        ],
      },
      {
        id: "coconut-water",
        name: "AJ Coconut Water Range",
        features: "Natural coconut hydration drinks, multiple sizes.",
        products: [
          { name: "Coconut Water", image: "/images/products/coconut-water-320ml.png", pack: "24 × 320 ml", price: "$30.00" },
          { name: "Coconut Water", image: "/images/products/coconut-water-490ml.png", pack: "24 × 490 ml", price: "$38.00" },
          { name: "Coconut Water", image: "/images/products/coconut-water-1l.png", pack: "12 × 1 L", price: "$30.00" },
          { name: "Coconut Water", image: "/images/products/coconut-water-1250ml.png", pack: "12 × 1.25 L", price: "$36.00" },
          { name: "Watermelon Coconut Water", image: "/images/products/watermelon-coconut-water.png", pack: "24 × 490 ml", price: "$38.00 + GST" },
          { name: "Passionfruit Coconut Water", image: "/images/products/passionfruit-coconut-water.png", pack: "24 × 490 ml", price: "$38.00 + GST" },
        ],
      },
      {
        id: "basil-seed",
        name: "Basil Seed Drinks",
        features: "Drinks with basil seeds for texture and health appeal.",
        defaultPack: "24 × 290 ml",
        defaultPrice: "$24.00 + GST",
        products: [
          { name: "Strawberry", image: "/images/products/basil-seed-strawberry.png" },
          { name: "Pomegranate", image: "/images/products/basil-seed-pomegranate.png" },
          { name: "Watermelon", image: "/images/products/basil-seed-watermelon.png" },
          { name: "Mango", image: "/images/products/basil-seed-mango.png" },
          { name: "Cocktail", image: "/images/products/basil-seed-cocktail.png" },
          { name: "Orange", image: "/images/products/basil-seed-orange.png" },
          { name: "Guava", image: "/images/products/basil-seed-guava.png" },
          { name: "Peach", image: "/images/products/basil-seed-peach.png" },
          { name: "Passionfruit", image: "/images/products/basil-seed-passionfruit.png" },
          { name: "Raspberry", image: "/images/products/basil-seed-raspberry.png" },
          { name: "Lychee", image: "/images/products/basil-seed-lychee.png" },
          { name: "Blueberry", image: "/images/products/basil-seed-blueberry.png" },
          { name: "Pineapple", image: "/images/products/basil-seed-pineapple.png" },
        ],
      },
      {
        id: "coco-queen",
        name: "Coco Queen Drinks",
        features: "Fruit-flavoured drinks in premium plastic bottles.",
        defaultPack: "24 × 320 ml",
        defaultPrice: "$29.00 + GST",
        products: [
          { name: "Strawberry", image: "/images/products/coco-queen-strawberry.png" },
          { name: "Blue Raspberry", image: "/images/products/coco-queen-blue-raspberry.png" },
          { name: "Melon", image: "/images/products/coco-queen-melon.png" },
          { name: "Pineapple", image: "/images/products/coco-queen-pineapple.png" },
          { name: "Lychee", image: "/images/products/coco-queen-lychee.png" },
          { name: "Mango", image: "/images/products/coco-queen-mango.png" },
          { name: "Watermelon", image: "/images/products/coco-queen-watermelon.png" },
          { name: "Grape", image: "/images/products/coco-queen-grape.png" },
          { name: "Orange", image: "/images/products/coco-queen-orange.png" },
        ],
      },
      {
        id: "okf-aloe",
        name: "OKF Aloe Drinks",
        features: "Premium aloe vera beverages in multiple sizes.",
        products: [
          { name: "Original (Large)", image: "/images/products/okf-aloe-original-1500ml.png", pack: "12 × 1.5 L", price: "$28.00 + GST" },
          { name: "Peach (Large)", image: "/images/products/okf-aloe-peach-1500ml.png", pack: "12 × 1.5 L", price: "$28.00 + GST" },
          { name: "Mango (Large)", image: "/images/products/okf-aloe-mango-1500ml.png", pack: "12 × 1.5 L", price: "$28.00 + GST" },
          { name: "Pomegranate (Large)", image: "/images/products/okf-aloe-pomegranate-1500ml.png", pack: "12 × 1.5 L", price: "$28.00 + GST" },
          { name: "Mango (Medium)", image: "/images/products/okf-aloe-mango-500ml.png", pack: "20 × 500 ml", price: "$28.00 + GST" },
          { name: "Pineapple (Medium)", image: "/images/products/okf-aloe-pineapple-500ml.png", pack: "20 × 500 ml", price: "$28.00 + GST" },
          { name: "Pomegranate (Medium)", image: "/images/products/okf-aloe-pomegranate-500ml.png", pack: "20 × 500 ml", price: "$28.00 + GST" },
          { name: "Strawberry (Medium)", image: "/images/products/okf-aloe-strawberry-500ml.png", pack: "20 × 500 ml", price: "$28.00 + GST" },
          { name: "Original (Medium)", image: "/images/products/okf-aloe-original-500ml.png", pack: "20 × 500 ml", price: "$28.00 + GST" },
        ],
      },
      {
        id: "soft-energy",
        name: "Soft Drinks & Energy Drinks",
        features: "Popular carbonated and energy beverages.",
        products: [
          { name: "AJ Cola", image: "/images/products/aj-cola.png", pack: "24 × 320 ml", price: "$16.00 + GST" },
          { name: "7UP", image: "/images/products/7up.png", pack: "24 × 320 ml", price: "$24.00 + GST" },
          { name: "Fanta Orange", image: "/images/products/fanta-orange.png", pack: "24 × 320 ml", price: "$24.00 + GST" },
          { name: "Fanta Strawberry", image: "/images/products/fanta-strawberry.png", pack: "24 × 320 ml", price: "$24.00 + GST" },
          { name: "Fanta Grape", image: "/images/products/fanta-grape.png", pack: "24 × 320 ml", price: "$24.00 + GST" },
          { name: "Mountain Dew", image: "/images/products/mountain-dew.png", pack: "24 × 320 ml", price: "$24.00 + GST" },
          { name: "Coca-Cola", image: "/images/products/coca-cola.png", pack: "6 × 4-pack × 320 ml", price: "$24.00 + GST" },
          { name: "Red Bull", image: "/images/products/redbull.png", pack: "24 × 250 ml", price: "$33.00 + GST" },
          { name: "Ginseng Energy Drink", image: "/images/products/ginseng-energy.png", pack: "24 × 250 ml", price: "$38.00 + GST" },
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
          { name: "Nescafe Classic Jar", image: "/images/products/nescafe-classic-jar.png", pack: "12 × 200 g", price: "$138.00 + GST" },
          { name: "Nescafe 3-in-1", image: "/images/products/nescafe-3in1.png", pack: "24 × 25 × 18 g", price: "$148.60 + GST" },
          { name: "Coffee Mate", image: "/images/products/coffee-mate.png", pack: "12 × 1 kg", price: "$95.80 + GST" },
        ],
      },
      {
        id: "honey",
        name: "Honey",
        products: [
          { name: "Asal Honey", image: "/images/products/asal-honey.png", pack: "12 × 1 kg", price: "$192.00 + GST" },
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
          { name: "Green Tea Teabag", image: "/images/products/green-tea-teabag.png", pack: "24 × 200 g", price: "$120.00" },
          { name: "Green Tea Loose", image: "/images/products/green-tea-loose.png", pack: "24 × 500 g", price: "$132.00" },
          { name: "Green Tea Jar (800g)", image: "/images/products/green-tea-jar-800g.png", pack: "8 × 800 g", price: "$80.00" },
          { name: "Green Tea Jar (500g)", image: "/images/products/green-tea-jar-500g.png", pack: "12 × 500 g", price: "$66.00" },
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
          { name: "Dried Sweet Apricot", image: "/images/products/dried-sweet-apricot.png", pack: "14 × 700 g", price: "$98.00" },
          { name: "Dried Sour Apricot", image: "/images/products/dried-sour-apricot.png", pack: "14 × 700 g" },
          { name: "Dried Black Mulberry", image: "/images/products/dried-black-mulberry.png", pack: "14 × 700 g", price: "$98.00" },
          { name: "Dried White Mulberry", image: "/images/products/dried-white-mulberry.png", pack: "12 × 700 g", price: "$120.00" },
          { name: "Green Sultana", image: "/images/products/green-sultana.png", pack: "15 × 700 g", price: "$105.00" },
          { name: "Australian Almond", image: "/images/products/australian-almond.png", pack: "15 × 700 g" },
          { name: "AJ Walnuts", image: "/images/products/walnuts.png", pack: "10 × 700 g" },
          { name: "Salted Roasted Cashew", image: "/images/products/salted-roasted-cashew.png", pack: "12 × 700 g", price: "$168.00" },
          { name: "Unsalted Roasted Cashew", image: "/images/products/unsalted-roasted-cashew.png", pack: "12 × 700 g", price: "$168.00" },
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
          { name: "Soneri Daily Use Rice", image: "/images/products/soneri-daily-use.png", pack: "4 × 5 kg", price: "$52.00" },
          { name: "Soneri Basmati Super Kernel", image: "/images/products/soneri-basmati-super-kernel.png", pack: "4 × 5 kg", price: "$64.00" },
          { name: "Soneri Premium Basmati", image: "/images/products/soneri-premium-basmati.png", pack: "4 × 5 kg", price: "$64.00" },
          { name: "Soneri Golden Sella", image: "/images/products/soneri-golden-sella.png", pack: "4 × 5 kg", price: "$64.00" },
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
          { name: "10 kg Charcoal Bag", image: "/images/products/charcoal-10kg-bag.png", price: "$17.00 + GST" },
          { name: "5 kg Charcoal Bag", image: "/images/products/charcoal-5kg-bag.png", price: "$8.50 + GST" },
          { name: "10 kg Charcoal Box", image: "/images/products/charcoal-10kg-box.png", price: "$19.00 + GST" },
          { name: "10 × 1 kg Shisha Charcoal Box", image: "/images/products/shisha-charcoal.png", price: "$50.00 + GST" },
          { name: "10 kg AJ Wood Charcoal", image: "/images/products/charcoal-10kg-wood.png", price: "$17.00 + GST" },
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
          { name: "Harris Mango Juice", image: "/images/products/harris-mango-2l.png", pack: "6 × 2 L", price: "$24.00 + GST" },
          { name: "Harris Guava Juice", image: "/images/products/harris-guava-2l.png", pack: "6 × 2 L", price: "$24.00 + GST" },
          { name: "Harris Mango Juice", image: "/images/products/harris-mango-1l.png", pack: "12 × 1 L", price: "$24.00 + GST" },
          { name: "Harris Pink Guava", image: "/images/products/harris-pink-guava-1l.png", pack: "12 × 1 L", price: "$24.00 + GST" },
          { name: "Harris White Guava", image: "/images/products/harris-white-guava-1l.png", pack: "12 × 1 L", price: "$24.00 + GST" },
          { name: "Harris Tropical Juice", image: "/images/products/harris-tropical-1l.png", pack: "12 × 1 L", price: "$24.00 + GST" },
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
          { name: "Indomie 40 Pack Box", image: "/images/products/indomie-40pack.png", pack: "40 × 85 g", price: "$15.00" },
          { name: "Indomie 5 Pack", image: "/images/products/indomie-5pack.png", pack: "8 × 5 × 85 g", price: "$17.00" },
          { name: "Indomie 10 Pack", image: "/images/products/indomie-10pack.png", pack: "6 × 10 × 85 g", price: "$29.00" },
          { name: "Indomie Hot & Spicy", image: "/images/products/indomie-hot-spicy.png", pack: "8 × 5 × 80 g", price: "$23.00" },
          { name: "Indomie Spicy Gourmet", image: "/images/products/indomie-spicy-gourmet.png", pack: "8 × 5 × 80 g" },
          { name: "Maggi Kari (Curry)", image: "/images/products/maggi-kari.png", pack: "12 × 5 × 79 g" },
          { name: "Maggi Ayam (Chicken)", image: "/images/products/maggi-ayam.png", pack: "12 × 5 × 77 g", price: "$33.00" },
          { name: "Maggi Tom Yam", image: "/images/products/maggi-tom-yam.png", pack: "12 × 5 × 80 g", price: "$33.00" },
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
          { name: "Biryani", image: "/images/products/shan-biryani.png" },
          { name: "Hunter Beef", image: "/images/products/shan-hunter-beef.png" },
          { name: "Fried Chops/Steaks", image: "/images/products/shan-fried-chops.png" },
          { name: "Fish Biryani", image: "/images/products/shan-fish-biryani.png" },
          { name: "Chaat Masala", image: "/images/products/shan-chaat-masala.png" },
          { name: "Chicken Handi", image: "/images/products/shan-chicken-handi.png" },
          { name: "Chicken Broast", image: "/images/products/shan-chicken-broast.png" },
          { name: "Bihari Kabab", image: "/images/products/shan-bihari-kabab.png" },
          { name: "Butter Chicken", image: "/images/products/shan-butter-chicken.png" },
          { name: "Achar Gosht", image: "/images/products/shan-achar-gosht.png" },
          { name: "Seekh Kabab", image: "/images/products/shan-seekh-kabab.png" },
          { name: "Punjabi Yakhni Pilau", image: "/images/products/shan-punjabi-yakhni.png" },
          { name: "Pilau Biryani", image: "/images/products/shan-pilau-biryani.png" },
          { name: "Paya Mix", image: "/images/products/shan-paya-mix.png" },
          { name: "Pav Bhaji", image: "/images/products/shan-pav-bhaji.png" },
          { name: "Nihari", image: "/images/products/shan-nihari.png" },
          { name: "Mix Veg Biryani", image: "/images/products/shan-mix-veg-biryani.png" },
          { name: "Meat & Vegetable", image: "/images/products/shan-meat-vegetable.png" },
          { name: "Meat Masala", image: "/images/products/shan-meat-masala.png" },
          { name: "Memoni Biryani", image: "/images/products/shan-memoni-biryani.png" },
          { name: "Liver Curry", image: "/images/products/shan-liver-curry.png" },
          { name: "Lahori Charga", image: "/images/products/shan-lahori-charga.png" },
          { name: "Korma Masala", image: "/images/products/shan-korma-masala.png" },
          { name: "Kofta Masala", image: "/images/products/shan-kofta-masala.png" },
          { name: "Karachi Beef Biryani", image: "/images/products/shan-karachi-beef-biryani.png" },
          { name: "Tandoori Masala", image: "/images/products/shan-tandoori.png" },
          { name: "Chicken Masala", image: "/images/products/shan-chicken-masala.png" },
          { name: "Chicken Tikka", image: "/images/products/shan-chicken-tikka.png" },
          { name: "Karahi", image: "/images/products/shan-karahi.png" },
          { name: "Malay Chicken Biryani", image: "/images/products/shan-malay-chicken-biryani.png" },
          { name: "Special Bombay Biryani", image: "/images/products/shan-special-bombay-biryani.png" },
          { name: "Vegetable Masala", image: "/images/products/shan-vegetable-masala.png" },
          { name: "Tikka", image: "/images/products/shan-tikka.png" },
          { name: "Curry Powder", image: "/images/products/shan-curry-powder.png" },
          { name: "Chapli Kabab", image: "/images/products/shan-chapli-kabab.png" },
          { name: "Sindhi Biryani", image: "/images/products/shan-sindhi-biryani.png" },
          { name: "Tikka Seekh Kabab", image: "/images/products/shan-tikka-seekh-kabab.png" },
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
          { name: "Kopiko Coffee Candy", image: "/images/products/kopiko-coffee.png", pack: "24 × 50 pcs (175 g)", price: "$36.00 + GST" },
          { name: "Kopiko Cappuccino Candy", image: "/images/products/kopiko-cappuccino.png", pack: "24 × 50 pcs", price: "$36.00 + GST" },
          { name: "Mentos Pouch Mint", image: "/images/products/mentos-mint.png", price: "$40.00 + GST" },
          { name: "Mentos Pouch Fruity", image: "/images/products/mentos-fruity.png", price: "$40.00 + GST" },
          { name: "Mentos Mix Fruit", image: "/images/products/mentos-mix-fruit.png", price: "$40.00 + GST" },
          { name: "I-Pop", image: "/images/products/ipop.png", price: "$30.00 + GST" },
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
          { name: "Soneri Himalayan Salt", image: "/images/products/soneri-himalayan-salt.png", pack: "12 × 1 kg", price: "$24.00 + GST" },
          { name: "Salina Salt", image: "/images/products/salina-salt.png", pack: "12 × 1.5 kg", price: "$30.00 + GST" },
          { name: "Haaris Fried Onion 1 kg", image: "/images/products/haaris-fried-onion-1kg.png", pack: "10 × 1 kg", price: "$60.00 + GST" },
          { name: "Haaris Fried Onion 400 g", image: "/images/products/haaris-fried-onion-400g.png", pack: "24 × 400 g", price: "$60.00 + GST" },
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
          { name: "Disposable Tablecloth Roll", image: "/images/products/disposable-tablecloth.png", pack: "12 pcs per box", price: "$120.00" },
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
    year: "2023",
    title: "AJ Fresh Foods Pty Ltd Established",
    description:
      "Founded in 2023 with a vision to bring quality, affordable grocery products to retailers across Australia.",
  },
  {
    year: "Growth",
    title: "Product Range Expansion",
    description:
      "Rapidly expanded to 12 product categories including beverages, spices, rice, noodles, and household goods.",
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
