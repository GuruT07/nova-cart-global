import fs from 'fs';

const CITIES = ['Bangalore', 'Mumbai', 'Delhi'];
const CATEGORIES = {
  'Dairy': ['Amul Milk 500ml', 'Nandini Milk 500ml', 'Milky Mist Paneer 200g', 'Amul Butter 100g', 'Britannia Cheese Slices', 'Epigamia Greek Yogurt', 'Mother Dairy Lassi', 'Gowardhan Ghee 500ml', 'Danone Yogurt', 'Amul Cheese Spread', 'Milky Mist Mozzarella', 'Nandini Curd 500g', 'Yakult Probiotic', 'Amul Fresh Cream', 'Nestle Dairy Whitener'],
  'Bakery': ['Britannia White Bread', 'Modern Whole Wheat Bread', 'English Oven Brown Bread', 'Harvest Gold Burger Buns', 'Britannia Pav', 'Sweet Buns', 'Garlic Bread', 'Chocolate Muffins', 'Vanilla Pound Cake', 'Butter Croissant', 'Bakery Biscuits', 'Rusk Toast', 'Whole Wheat Pita', 'Pizza Base', 'Multigrain Bread'],
  'Snacks': ['Lays Classic Salted', 'Kurkure Masala Munch', 'Bingo Mad Angles', 'Haldiram Bhujia', 'Doritos Nacho Cheese', 'Pringles Original', 'Cheetos Cheese Puffs', 'Uncle Chipps', 'Balaji Wafers', 'Too Yumm Multigrain', 'Makhanas Masala', 'Diet Chivda', 'Roasted Peanuts', 'Popcorn Salted', 'Nacho Chips'],
  'Grocery Staples': ['Aashirvaad Atta 5kg', 'India Gate Basmati Rice 1kg', 'Tata Salt 1kg', 'Fortune Sunflower Oil 1L', 'Toor Dal 1kg', 'Moong Dal 500g', 'Chana Dal 500g', 'Kabuli Chana 500g', 'Sugar 1kg', 'Jaggery Powder 500g', 'Saffola Gold Oil 1L', 'Fortune Mustard Oil', 'Rajma 500g', 'Urad Dal 500g', 'Suji 500g'],
  'Pharmacy': ['Dolo 650mg', 'Crocin Advance', 'Digene Tablets', 'Vicks Vaporub', 'Volini Gel', 'Eno Lemon 100g', 'Pudin Hara Pearls', 'Gelusil Liquid', 'Strepsils Honey', 'Honitus Syrup', 'Betadine Ointment', 'Band-Aid Washproof', 'Savlon Liquid', 'Dettol Antiseptic', 'Moov Pain Relief'],
  'Stationery': ['Classmate Notebook', 'A4 Paper Rim', 'Reynolds Trimax Pen', 'Cello Gripper Pens (Pack of 5)', 'Apsara Pencils', 'Camlin Erasers', 'Fevicol MR', 'Cello Tape', 'Stapler Mini', 'Highlighter Pens', 'Marker Pen Black', 'Geometry Box', 'Post-it Notes', 'Ruler 30cm', 'Paper Clips'],
  'Beverages': ['Coca Cola 2L', 'Pepsi 600ml', 'Sprite 1.5L', 'Thums Up 2.25L', 'Red Bull 250ml', 'Real Orange Juice 1L', 'Tropicana Mixed Fruit', 'Frooti 1L', 'Maaza 1.2L', 'Sting Energy 250ml', 'Bisleri Water 1L', 'Kinley Soda 750ml', 'Gatorade Blue', 'Paperboat Aamras', 'Nescafe Cold Coffee'],
  'Personal Care': ['Dove Soap', 'Pears Soap', 'Colgate MaxFresh 150g', 'Pepsodent 150g', 'Sensodyne 75g', 'Head & Shoulders Shampoo', 'Sunsilk Shampoo', 'Tresemme Conditioner', 'Nivea Body Lotion', 'Vaseline Petroleum Jelly', 'Gillette Mach3 Razor', 'Old Spice Aftershave', 'Listerine Mouthwash', 'Whisper Choice Pads', 'Stayfree Secure']
};

const generateData = () => {
  const stores = [];
  let storeIdCounter = 1;
  CITIES.forEach(city => {
    for (let i = 1; i <= 4; i++) {
      stores.push({
        id: `S${storeIdCounter}`,
        name: `Nova ${city} Hub ${i}`,
        city: city,
        cancelRate: parseFloat((0.05 + Math.random() * 0.15).toFixed(2)),
        trustScore: Math.floor(60 + Math.random() * 40),
        fulfillmentScore: Math.floor(70 + Math.random() * 30),
        updateFreqScore: Math.floor(50 + Math.random() * 50)
      });
      storeIdCounter++;
    }
  });

  const products = [];
  let productIdCounter = 1;
  Object.keys(CATEGORIES).forEach(category => {
    const catProducts = [];
    CATEGORIES[category].forEach((itemName) => {
      catProducts.push({
        id: `P${productIdCounter}`,
        name: itemName,
        category: category,
        price: Math.floor(20 + Math.random() * 400),
        substituteId: null
      });
      productIdCounter++;
    });
    // Link substitutes
    for (let i = 0; i < catProducts.length; i++) {
      catProducts[i].substituteId = catProducts[(i + 1) % catProducts.length].id;
    }
    products.push(...catProducts);
  });

  const inventory = [];
  stores.forEach(store => {
    products.forEach(product => {
      const statedStock = Math.random() > 0.9 ? 0 : Math.floor(Math.random() * 100);
      inventory.push({
        id: `I_${store.id}_${product.id}`,
        storeId: store.id,
        productId: product.id,
        statedStock,
        lastUpdatedHours: Math.floor(Math.random() * 72),
        salesSpeed: parseFloat((Math.random() * 2).toFixed(2))
      });
    });
  });

  const unmetSearches = [
    { query: "Cough Syrup", count: 432, trend: "+25%" },
    { query: "Whole Wheat Bread", count: 310, trend: "+12%" },
    { query: "Dosa Batter", count: 289, trend: "+8%" },
    { query: "Ice Cream", count: 215, trend: "+15%" }
  ];

  const data = { stores, products, inventory, unmetSearches };
  fs.writeFileSync('./src/data.json', JSON.stringify(data, null, 2));
  console.log('Seeded data.json successfully with realistic names.');
};

generateData();
