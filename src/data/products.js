// LuxeCart Product Catalog
// All product data with variants, images, and metadata

const PRODUCT_IMAGES = {
  // We'll use gradient placeholders that look premium
  jacket1: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=750&fit=crop',
  jacket2: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=750&fit=crop',
  sneakers1: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop',
  sneakers2: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=750&fit=crop',
  watch1: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=750&fit=crop',
  watch2: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=750&fit=crop',
  bag1: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop',
  bag2: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=750&fit=crop',
  tshirt1: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop',
  tshirt2: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=750&fit=crop',
  sunglasses1: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=750&fit=crop',
  sunglasses2: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=750&fit=crop',
  hoodie1: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=750&fit=crop',
  hoodie2: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&h=750&fit=crop',
  pants1: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop',
  dress1: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=750&fit=crop',
  perfume1: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=750&fit=crop',
  wallet1: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=750&fit=crop',
  cap1: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600&h=750&fit=crop',
  boots1: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&h=750&fit=crop',
  scarf1: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=750&fit=crop',
  belt1: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=750&fit=crop',
  shirt1: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop',
  jeans1: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=750&fit=crop',
};

export const categories = [
  { id: 'all', name: 'All Products', icon: '✦', count: 24 },
  { id: 'clothing', name: 'Clothing', icon: '👔', count: 8 },
  { id: 'footwear', name: 'Footwear', icon: '👟', count: 4 },
  { id: 'accessories', name: 'Accessories', icon: '⌚', count: 8 },
  { id: 'bags', name: 'Bags', icon: '👜', count: 2 },
  { id: 'fragrance', name: 'Fragrance', icon: '✿', count: 1 },
];

export const brands = [
  'LuxeCart Originals',
  'Noir Studio',
  'Velvet & Co',
  'Urban Pulse',
  'Artisan Made',
  'Eclipse',
];

export const colors = [
  { name: 'Black', hex: '#1a1a2e' },
  { name: 'White', hex: '#f5f5f5' },
  { name: 'Navy', hex: '#1e3a5f' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Olive', hex: '#556b2f' },
  { name: 'Camel', hex: '#c19a6b' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Red', hex: '#dc2626' },
];

export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const products = [
  {
    id: 1,
    name: 'Midnight Leather Jacket',
    slug: 'midnight-leather-jacket',
    price: 349.99,
    originalPrice: 449.99,
    category: 'clothing',
    brand: 'Noir Studio',
    description: 'Crafted from premium Italian lambskin leather, this jacket features a sleek silhouette with matte black hardware. The satin-lined interior ensures comfort while maintaining a luxurious feel. Perfect for elevating any evening look.',
    images: [PRODUCT_IMAGES.jacket1, PRODUCT_IMAGES.jacket2],
    colors: ['Black', 'Burgundy', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.8,
    reviews: 124,
    inStock: true,
    isNew: false,
    isFeatured: true,
    isTrending: true,
    tags: ['leather', 'premium', 'outerwear'],
  },
  {
    id: 2,
    name: 'Velocity Pro Sneakers',
    slug: 'velocity-pro-sneakers',
    price: 189.99,
    originalPrice: null,
    category: 'footwear',
    brand: 'Urban Pulse',
    description: 'Engineered for both performance and style, these sneakers feature a responsive foam midsole, breathable knit upper, and a sculpted rubber outsole. The holographic accents catch light beautifully.',
    images: [PRODUCT_IMAGES.sneakers1, PRODUCT_IMAGES.sneakers2],
    colors: ['Red', 'Black', 'White'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.6,
    reviews: 89,
    inStock: true,
    isNew: true,
    isFeatured: true,
    isTrending: false,
    tags: ['sneakers', 'athletic', 'casual'],
  },
  {
    id: 3,
    name: 'Chronograph Elite Watch',
    slug: 'chronograph-elite-watch',
    price: 599.99,
    originalPrice: 749.99,
    category: 'accessories',
    brand: 'Eclipse',
    description: 'A masterpiece of horology featuring a Swiss-made automatic movement, sapphire crystal, and genuine alligator leather strap. Water-resistant to 100m with luminous hands and markers.',
    images: [PRODUCT_IMAGES.watch1, PRODUCT_IMAGES.watch2],
    colors: ['Black', 'Camel'],
    sizes: [],
    rating: 4.9,
    reviews: 56,
    inStock: true,
    isNew: false,
    isFeatured: true,
    isTrending: true,
    tags: ['watch', 'luxury', 'timepiece'],
  },
  {
    id: 4,
    name: 'Heritage Leather Tote',
    slug: 'heritage-leather-tote',
    price: 275.00,
    originalPrice: null,
    category: 'bags',
    brand: 'Artisan Made',
    description: 'Hand-stitched from full-grain vegetable-tanned leather, this tote develops a beautiful patina over time. Features a removable shoulder strap, interior laptop sleeve, and brass hardware.',
    images: [PRODUCT_IMAGES.bag1, PRODUCT_IMAGES.bag2],
    colors: ['Camel', 'Black', 'Burgundy'],
    sizes: [],
    rating: 4.7,
    reviews: 73,
    inStock: true,
    isNew: false,
    isFeatured: true,
    isTrending: false,
    tags: ['bag', 'leather', 'everyday'],
  },
  {
    id: 5,
    name: 'Essential Cotton Tee',
    slug: 'essential-cotton-tee',
    price: 49.99,
    originalPrice: null,
    category: 'clothing',
    brand: 'LuxeCart Originals',
    description: 'Made from 100% organic Supima cotton, this tee offers a buttery-soft hand feel with a perfect relaxed fit. Pre-washed to minimize shrinkage. The ideal everyday essential.',
    images: [PRODUCT_IMAGES.tshirt1, PRODUCT_IMAGES.tshirt2],
    colors: ['White', 'Black', 'Navy', 'Grey'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.5,
    reviews: 312,
    inStock: true,
    isNew: false,
    isFeatured: false,
    isTrending: true,
    tags: ['tshirt', 'essential', 'cotton'],
  },
  {
    id: 6,
    name: 'Polarized Aviator Shades',
    slug: 'polarized-aviator-shades',
    price: 159.99,
    originalPrice: 199.99,
    category: 'accessories',
    brand: 'Eclipse',
    description: 'Premium titanium frames with polarized mineral glass lenses providing 100% UV protection. Ultra-lightweight at just 28g with adjustable nose pads for a custom fit.',
    images: [PRODUCT_IMAGES.sunglasses1, PRODUCT_IMAGES.sunglasses2],
    colors: ['Black', 'Grey'],
    sizes: [],
    rating: 4.7,
    reviews: 198,
    inStock: true,
    isNew: false,
    isFeatured: false,
    isTrending: true,
    tags: ['sunglasses', 'polarized', 'accessory'],
  },
  {
    id: 7,
    name: 'Tech Fleece Hoodie',
    slug: 'tech-fleece-hoodie',
    price: 129.99,
    originalPrice: null,
    category: 'clothing',
    brand: 'Urban Pulse',
    description: 'Double-knit spacer fabric provides warmth without weight. Features a scuba-style hood, hidden zip pockets, and ribbed cuffs. Moisture-wicking interior keeps you comfortable all day.',
    images: [PRODUCT_IMAGES.hoodie1, PRODUCT_IMAGES.hoodie2],
    colors: ['Black', 'Grey', 'Navy', 'Olive'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.6,
    reviews: 267,
    inStock: true,
    isNew: true,
    isFeatured: false,
    isTrending: true,
    tags: ['hoodie', 'tech', 'casual'],
  },
  {
    id: 8,
    name: 'Tailored Slim Chinos',
    slug: 'tailored-slim-chinos',
    price: 89.99,
    originalPrice: null,
    category: 'clothing',
    brand: 'Velvet & Co',
    description: 'Precision-cut from stretch twill cotton with a modern slim fit. Features a hidden coin pocket, reinforced seams, and a comfortable mid-rise waist. Pairs perfectly from office to evening.',
    images: [PRODUCT_IMAGES.pants1],
    colors: ['Navy', 'Camel', 'Olive', 'Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.4,
    reviews: 156,
    inStock: true,
    isNew: false,
    isFeatured: false,
    isTrending: false,
    tags: ['pants', 'chinos', 'formal'],
  },
  {
    id: 9,
    name: 'Noir Evening Dress',
    slug: 'noir-evening-dress',
    price: 299.99,
    originalPrice: 399.99,
    category: 'clothing',
    brand: 'Noir Studio',
    description: 'A statement piece crafted from flowing silk-blend fabric with a flattering A-line silhouette. Features delicate spaghetti straps, a plunging neckline, and an asymmetric hemline.',
    images: [PRODUCT_IMAGES.dress1],
    colors: ['Black', 'Burgundy'],
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.8,
    reviews: 45,
    inStock: true,
    isNew: true,
    isFeatured: true,
    isTrending: false,
    tags: ['dress', 'evening', 'luxury'],
  },
  {
    id: 10,
    name: 'Oud Royale Parfum',
    slug: 'oud-royale-parfum',
    price: 225.00,
    originalPrice: null,
    category: 'fragrance',
    brand: 'Noir Studio',
    description: 'An intoxicating blend of rare oud wood, damask rose, and amber. This unisex parfum features top notes of bergamot and saffron, evolving into a rich base of sandalwood and musk.',
    images: [PRODUCT_IMAGES.perfume1],
    colors: [],
    sizes: [],
    rating: 4.9,
    reviews: 87,
    inStock: true,
    isNew: false,
    isFeatured: true,
    isTrending: true,
    tags: ['perfume', 'oud', 'luxury'],
  },
  {
    id: 11,
    name: 'Minimalist Card Wallet',
    slug: 'minimalist-card-wallet',
    price: 69.99,
    originalPrice: null,
    category: 'accessories',
    brand: 'Artisan Made',
    description: 'Slim profile card wallet crafted from Horween leather. Holds up to 8 cards with a center cash slot. RFID blocking technology built in. Develops a gorgeous patina with use.',
    images: [PRODUCT_IMAGES.wallet1],
    colors: ['Black', 'Camel', 'Burgundy'],
    sizes: [],
    rating: 4.6,
    reviews: 234,
    inStock: true,
    isNew: false,
    isFeatured: false,
    isTrending: false,
    tags: ['wallet', 'leather', 'minimal'],
  },
  {
    id: 12,
    name: 'Structured Baseball Cap',
    slug: 'structured-baseball-cap',
    price: 39.99,
    originalPrice: null,
    category: 'accessories',
    brand: 'LuxeCart Originals',
    description: 'Premium cotton twill cap with a structured six-panel design. Features an embroidered tonal logo, adjustable brass clasp closure, and pre-curved brim.',
    images: [PRODUCT_IMAGES.cap1],
    colors: ['Black', 'Navy', 'White', 'Olive'],
    sizes: [],
    rating: 4.3,
    reviews: 445,
    inStock: true,
    isNew: false,
    isFeatured: false,
    isTrending: false,
    tags: ['cap', 'hat', 'casual'],
  },
  {
    id: 13,
    name: 'Chelsea Suede Boots',
    slug: 'chelsea-suede-boots',
    price: 259.99,
    originalPrice: 319.99,
    category: 'footwear',
    brand: 'Velvet & Co',
    description: 'Classic Chelsea silhouette in premium Italian suede. Features elastic side panels, a stacked leather heel, and a Goodyear-welted rubber sole for durability and comfort.',
    images: [PRODUCT_IMAGES.boots1],
    colors: ['Camel', 'Black', 'Grey'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.7,
    reviews: 98,
    inStock: true,
    isNew: false,
    isFeatured: false,
    isTrending: true,
    tags: ['boots', 'suede', 'chelsea'],
  },
  {
    id: 14,
    name: 'Cashmere Blend Scarf',
    slug: 'cashmere-blend-scarf',
    price: 119.99,
    originalPrice: null,
    category: 'accessories',
    brand: 'Velvet & Co',
    description: 'Woven from a luxurious blend of cashmere and merino wool. Generously sized at 200cm x 70cm with hand-rolled edges and subtle fringe detail. Incredibly soft against the skin.',
    images: [PRODUCT_IMAGES.scarf1],
    colors: ['Grey', 'Camel', 'Navy', 'Burgundy'],
    sizes: [],
    rating: 4.8,
    reviews: 67,
    inStock: true,
    isNew: true,
    isFeatured: false,
    isTrending: false,
    tags: ['scarf', 'cashmere', 'winter'],
  },
  {
    id: 15,
    name: 'Braided Leather Belt',
    slug: 'braided-leather-belt',
    price: 79.99,
    originalPrice: null,
    category: 'accessories',
    brand: 'Artisan Made',
    description: 'Hand-braided from strips of vegetable-tanned leather. Features a solid brass buckle with antique finish. Flexible sizing means no belt holes needed — just push through at your preferred size.',
    images: [PRODUCT_IMAGES.belt1],
    colors: ['Camel', 'Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.5,
    reviews: 189,
    inStock: true,
    isNew: false,
    isFeatured: false,
    isTrending: false,
    tags: ['belt', 'leather', 'braided'],
  },
  {
    id: 16,
    name: 'Linen Blend Shirt',
    slug: 'linen-blend-shirt',
    price: 99.99,
    originalPrice: null,
    category: 'clothing',
    brand: 'LuxeCart Originals',
    description: 'A warm-weather essential in a breathable linen-cotton blend. Features a relaxed camp collar, mother-of-pearl buttons, and a straight hemline for untucked wear. Garment-dyed for a lived-in look.',
    images: [PRODUCT_IMAGES.shirt1],
    colors: ['White', 'Navy', 'Olive', 'Camel'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.4,
    reviews: 143,
    inStock: true,
    isNew: false,
    isFeatured: false,
    isTrending: false,
    tags: ['shirt', 'linen', 'summer'],
  },
  {
    id: 17,
    name: 'Selvedge Raw Denim',
    slug: 'selvedge-raw-denim',
    price: 179.99,
    originalPrice: null,
    category: 'clothing',
    brand: 'Urban Pulse',
    description: 'Made from 14oz Japanese selvedge denim on vintage shuttle looms. Unwashed and unsanforized for maximum fade potential. Leather patch, copper rivets, and chain-stitched hem.',
    images: [PRODUCT_IMAGES.jeans1],
    colors: ['Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.7,
    reviews: 78,
    inStock: true,
    isNew: false,
    isFeatured: false,
    isTrending: true,
    tags: ['jeans', 'denim', 'raw'],
  },
  {
    id: 18,
    name: 'Canvas Weekend Bag',
    slug: 'canvas-weekend-bag',
    price: 199.99,
    originalPrice: 249.99,
    category: 'bags',
    brand: 'Artisan Made',
    description: 'Heavy-duty waxed canvas body with full-grain leather handles and detailing. Brass zippers and hardware throughout. Interior features a padded laptop compartment and multiple organizer pockets.',
    images: [PRODUCT_IMAGES.bag2],
    colors: ['Olive', 'Grey', 'Navy'],
    sizes: [],
    rating: 4.6,
    reviews: 112,
    inStock: true,
    isNew: false,
    isFeatured: false,
    isTrending: false,
    tags: ['bag', 'canvas', 'travel'],
  },
  {
    id: 19,
    name: 'Athletic Runner X1',
    slug: 'athletic-runner-x1',
    price: 159.99,
    originalPrice: null,
    category: 'footwear',
    brand: 'Urban Pulse',
    description: 'Next-generation running shoe with a carbon fiber plate and nitrogen-infused foam midsole. Engineered mesh upper provides targeted support zones. Reflective accents for low-light visibility.',
    images: [PRODUCT_IMAGES.sneakers2],
    colors: ['Black', 'White', 'Red'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.5,
    reviews: 201,
    inStock: true,
    isNew: true,
    isFeatured: false,
    isTrending: false,
    tags: ['sneakers', 'running', 'athletic'],
  },
  {
    id: 20,
    name: 'Sapphire Dial Watch',
    slug: 'sapphire-dial-watch',
    price: 425.00,
    originalPrice: null,
    category: 'accessories',
    brand: 'Eclipse',
    description: 'A dress watch with a stunning deep blue sunburst dial. Japanese quartz movement with date complication. 40mm stainless steel case with a genuine leather strap. 50m water resistance.',
    images: [PRODUCT_IMAGES.watch2],
    colors: ['Navy', 'Black'],
    sizes: [],
    rating: 4.8,
    reviews: 34,
    inStock: true,
    isNew: true,
    isFeatured: true,
    isTrending: false,
    tags: ['watch', 'dress', 'sapphire'],
  },
];

export const coupons = {
  LUXE10: { type: 'percentage', value: 10, description: '10% off your order' },
  SAVE20: { type: 'percentage', value: 20, description: '20% off your order' },
  FREESHIP: { type: 'freeShipping', value: 0, description: 'Free shipping on your order' },
  WELCOME15: { type: 'percentage', value: 15, description: '15% off for new customers' },
  FLAT50: { type: 'fixed', value: 50, description: '$50 off orders over $200' },
};

export const reviews = [
  { id: 1, productId: 1, user: 'Alex M.', rating: 5, date: '2024-12-15', comment: 'Absolutely stunning jacket. The leather quality is exceptional and the fit is perfect. Worth every penny.' },
  { id: 2, productId: 1, user: 'Sarah K.', rating: 5, date: '2024-11-28', comment: 'Got so many compliments wearing this. The matte hardware really sets it apart from other leather jackets.' },
  { id: 3, productId: 1, user: 'James R.', rating: 4, date: '2024-11-10', comment: 'Great quality, runs slightly small. I\'d recommend sizing up if you\'re between sizes.' },
  { id: 4, productId: 2, user: 'Mike T.', rating: 5, date: '2024-12-20', comment: 'These sneakers are incredibly comfortable. The foam midsole is like walking on clouds.' },
  { id: 5, productId: 2, user: 'Emily W.', rating: 4, date: '2024-12-05', comment: 'Love the holographic accents! They catch light beautifully. Very stylish.' },
  { id: 6, productId: 3, user: 'David L.', rating: 5, date: '2024-12-18', comment: 'A true horological masterpiece. The automatic movement is mesmerizing through the exhibition caseback.' },
  { id: 7, productId: 5, user: 'Chris P.', rating: 5, date: '2024-12-22', comment: 'Best basic tee I\'ve ever owned. The Supima cotton is incredibly soft. Already ordered 3 more.' },
  { id: 8, productId: 5, user: 'Nina S.', rating: 4, date: '2024-12-01', comment: 'Great quality for the price. Washes well and hasn\'t shrunk at all after multiple washes.' },
  { id: 9, productId: 7, user: 'Tom B.', rating: 5, date: '2024-12-10', comment: 'The tech fleece material is amazing. Warm without being bulky. Perfect for layering.' },
  { id: 10, productId: 10, user: 'Sofia R.', rating: 5, date: '2024-12-19', comment: 'The oud in this fragrance is absolutely divine. It lasts all day and gets constant compliments.' },
];

export function getProductById(id) {
  return products.find(p => p.id === parseInt(id));
}

export function getProductBySlug(slug) {
  return products.find(p => p.slug === slug);
}

export function getProductsByCategory(category) {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
}

export function getFeaturedProducts() {
  return products.filter(p => p.isFeatured);
}

export function getTrendingProducts() {
  return products.filter(p => p.isTrending);
}

export function getNewProducts() {
  return products.filter(p => p.isNew);
}

export function getProductReviews(productId) {
  return reviews.filter(r => r.productId === parseInt(productId));
}

export function searchProducts(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q)) ||
    p.category.toLowerCase().includes(q)
  );
}

export function filterProducts({ category, priceRange, colors: colorFilter, sizes: sizeFilter, brands: brandFilter, sort }) {
  let filtered = [...products];

  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (priceRange) {
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
  }

  if (colorFilter && colorFilter.length > 0) {
    filtered = filtered.filter(p => p.colors.some(c => colorFilter.includes(c)));
  }

  if (sizeFilter && sizeFilter.length > 0) {
    filtered = filtered.filter(p => p.sizes.some(s => sizeFilter.includes(s)));
  }

  if (brandFilter && brandFilter.length > 0) {
    filtered = filtered.filter(p => brandFilter.includes(p.brand));
  }

  // Sorting
  switch (sort) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // Featured first, then by rating
      filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating);
  }

  return filtered;
}
