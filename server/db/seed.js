import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getDb, runQuery, getOne, getAll, saveDbSync } from './connection.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Seed the database with initial data:
 * - Default admin user
 * - All products from the catalog
 * - Coupon codes
 */
export async function seedDatabase() {
  const db = await getDb();

  // Check if already seeded
  const existingProducts = getAll('SELECT COUNT(*) as count FROM products');
  if (existingProducts[0]?.count > 0) {
    console.log('ℹ Database already seeded, skipping...');
    return;
  }

  console.log('🌱 Seeding database...');

  // --- Seed Admin User ---
  const adminHash = await bcrypt.hash('admin123', 12);
  runQuery(
    `INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)`,
    ['admin@luxecart.com', adminHash, 'Admin', 'User', 'admin']
  );

  // --- Seed Demo Customer ---
  const demoHash = await bcrypt.hash('demo123', 12);
  runQuery(
    `INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)`,
    ['demo@luxecart.com', demoHash, 'Demo', 'Customer', 'customer']
  );

  console.log('  ✓ Users seeded (admin@luxecart.com / admin123)');
  console.log('  ✓ Users seeded (demo@luxecart.com / demo123)');

  // --- Seed Products ---
  const PRODUCT_IMAGES = {
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

  const products = [
    { name: 'Midnight Leather Jacket', slug: 'midnight-leather-jacket', price: 349.99, originalPrice: 449.99, category: 'clothing', brand: 'Noir Studio', description: 'Crafted from premium Italian lambskin leather, this jacket features a sleek silhouette with matte black hardware.', images: [PRODUCT_IMAGES.jacket1, PRODUCT_IMAGES.jacket2], colors: ['Black', 'Burgundy', 'Navy'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.8, reviews: 124, inStock: true, isNew: false, isFeatured: true, isTrending: true, tags: ['leather', 'premium', 'outerwear'] },
    { name: 'Velocity Pro Sneakers', slug: 'velocity-pro-sneakers', price: 189.99, originalPrice: null, category: 'footwear', brand: 'Urban Pulse', description: 'Engineered for both performance and style with a responsive foam midsole and breathable knit upper.', images: [PRODUCT_IMAGES.sneakers1, PRODUCT_IMAGES.sneakers2], colors: ['Red', 'Black', 'White'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.6, reviews: 89, inStock: true, isNew: true, isFeatured: true, isTrending: false, tags: ['sneakers', 'athletic', 'casual'] },
    { name: 'Chronograph Elite Watch', slug: 'chronograph-elite-watch', price: 599.99, originalPrice: 749.99, category: 'accessories', brand: 'Eclipse', description: 'A masterpiece of horology featuring a Swiss-made automatic movement and sapphire crystal.', images: [PRODUCT_IMAGES.watch1, PRODUCT_IMAGES.watch2], colors: ['Black', 'Camel'], sizes: [], rating: 4.9, reviews: 56, inStock: true, isNew: false, isFeatured: true, isTrending: true, tags: ['watch', 'luxury', 'automatic'] },
    { name: 'Heritage Weekender Bag', slug: 'heritage-weekender-bag', price: 279.99, originalPrice: null, category: 'bags', brand: 'Artisan Made', description: 'Hand-stitched from full-grain leather with brass hardware and a canvas-lined interior.', images: [PRODUCT_IMAGES.bag1, PRODUCT_IMAGES.bag2], colors: ['Camel', 'Black'], sizes: [], rating: 4.7, reviews: 73, inStock: true, isNew: false, isFeatured: true, isTrending: false, tags: ['bag', 'leather', 'travel'] },
    { name: 'Essential Cotton Tee', slug: 'essential-cotton-tee', price: 49.99, originalPrice: null, category: 'clothing', brand: 'LuxeCart Originals', description: 'Made from 100% organic Pima cotton with a relaxed fit and reinforced collar.', images: [PRODUCT_IMAGES.tshirt1, PRODUCT_IMAGES.tshirt2], colors: ['White', 'Black', 'Grey', 'Navy'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], rating: 4.5, reviews: 234, inStock: true, isNew: false, isFeatured: false, isTrending: true, tags: ['cotton', 'basics', 'essential'] },
    { name: 'Aviator Sunglasses', slug: 'aviator-sunglasses', price: 159.99, originalPrice: 199.99, category: 'accessories', brand: 'Eclipse', description: 'Classic aviator frames with polarized lenses and titanium temple arms.', images: [PRODUCT_IMAGES.sunglasses1, PRODUCT_IMAGES.sunglasses2], colors: ['Black', 'Grey'], sizes: [], rating: 4.4, reviews: 67, inStock: true, isNew: true, isFeatured: false, isTrending: false, tags: ['sunglasses', 'polarized', 'aviator'] },
    { name: 'Urban Hoodie', slug: 'urban-hoodie', price: 89.99, originalPrice: null, category: 'clothing', brand: 'Urban Pulse', description: 'Heavyweight French terry hoodie with kangaroo pocket and adjustable drawstring hood.', images: [PRODUCT_IMAGES.hoodie1, PRODUCT_IMAGES.hoodie2], colors: ['Black', 'Grey', 'Navy'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.6, reviews: 156, inStock: true, isNew: false, isFeatured: false, isTrending: true, tags: ['hoodie', 'streetwear', 'casual'] },
    { name: 'Tailored Chinos', slug: 'tailored-chinos', price: 119.99, originalPrice: null, category: 'clothing', brand: 'Velvet & Co', description: 'Slim-fit chinos crafted from stretch cotton twill with a refined silhouette.', images: [PRODUCT_IMAGES.pants1], colors: ['Olive', 'Camel', 'Navy', 'Black'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.5, reviews: 98, inStock: true, isNew: false, isFeatured: false, isTrending: false, tags: ['chinos', 'tailored', 'smart-casual'] },
    { name: 'Silk Evening Dress', slug: 'silk-evening-dress', price: 449.99, originalPrice: 599.99, category: 'clothing', brand: 'Velvet & Co', description: 'Flowing mulberry silk dress with a draped neckline and an open back.', images: [PRODUCT_IMAGES.dress1], colors: ['Burgundy', 'Black'], sizes: ['XS', 'S', 'M', 'L'], rating: 4.8, reviews: 34, inStock: true, isNew: true, isFeatured: true, isTrending: false, tags: ['dress', 'silk', 'evening'] },
    { name: 'Noir Eau de Parfum', slug: 'noir-eau-de-parfum', price: 129.99, originalPrice: null, category: 'fragrance', brand: 'Noir Studio', description: 'A complex fragrance opening with bergamot and black pepper, settling into oud, leather, and amber.', images: [PRODUCT_IMAGES.perfume1], colors: [], sizes: ['50ml', '100ml'], rating: 4.7, reviews: 89, inStock: true, isNew: false, isFeatured: true, isTrending: true, tags: ['fragrance', 'perfume', 'luxury'] },
    { name: 'Minimal Leather Wallet', slug: 'minimal-leather-wallet', price: 79.99, originalPrice: null, category: 'accessories', brand: 'Artisan Made', description: 'Slim bifold wallet handcrafted from vegetable-tanned Italian leather with RFID blocking.', images: [PRODUCT_IMAGES.wallet1], colors: ['Black', 'Camel'], sizes: [], rating: 4.3, reviews: 145, inStock: true, isNew: false, isFeatured: false, isTrending: false, tags: ['wallet', 'leather', 'rfid'] },
    { name: 'Structured Baseball Cap', slug: 'structured-baseball-cap', price: 39.99, originalPrice: null, category: 'accessories', brand: 'Urban Pulse', description: 'Six-panel structured cap with embroidered logo and adjustable strapback closure.', images: [PRODUCT_IMAGES.cap1], colors: ['Black', 'Navy', 'White'], sizes: [], rating: 4.2, reviews: 78, inStock: true, isNew: true, isFeatured: false, isTrending: false, tags: ['cap', 'hat', 'streetwear'] },
    { name: 'Chelsea Leather Boots', slug: 'chelsea-leather-boots', price: 259.99, originalPrice: 329.99, category: 'footwear', brand: 'Noir Studio', description: 'Classic Chelsea boots crafted from premium calfskin with elastic side panels and a leather sole.', images: [PRODUCT_IMAGES.boots1], colors: ['Black', 'Burgundy'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.7, reviews: 62, inStock: true, isNew: false, isFeatured: false, isTrending: true, tags: ['boots', 'chelsea', 'leather'] },
    { name: 'Cashmere Scarf', slug: 'cashmere-scarf', price: 149.99, originalPrice: null, category: 'accessories', brand: 'Velvet & Co', description: 'Luxuriously soft pure cashmere scarf with a subtle herringbone weave.', images: [PRODUCT_IMAGES.scarf1], colors: ['Grey', 'Camel', 'Navy'], sizes: [], rating: 4.6, reviews: 41, inStock: true, isNew: false, isFeatured: false, isTrending: false, tags: ['scarf', 'cashmere', 'winter'] },
    { name: 'Italian Leather Belt', slug: 'italian-leather-belt', price: 89.99, originalPrice: null, category: 'accessories', brand: 'Artisan Made', description: 'Hand-finished belt made from Italian full-grain leather with a brushed nickel buckle.', images: [PRODUCT_IMAGES.belt1], colors: ['Black', 'Camel'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.4, reviews: 93, inStock: true, isNew: false, isFeatured: false, isTrending: false, tags: ['belt', 'leather', 'italian'] },
    { name: 'Linen Oxford Shirt', slug: 'linen-oxford-shirt', price: 99.99, originalPrice: null, category: 'clothing', brand: 'LuxeCart Originals', description: 'Breathable linen-cotton blend oxford shirt with a button-down collar.', images: [PRODUCT_IMAGES.shirt1], colors: ['White', 'Navy', 'Olive'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.5, reviews: 112, inStock: true, isNew: true, isFeatured: false, isTrending: false, tags: ['shirt', 'linen', 'smart-casual'] },
    { name: 'Raw Selvedge Denim', slug: 'raw-selvedge-denim', price: 179.99, originalPrice: null, category: 'clothing', brand: 'Urban Pulse', description: 'Japanese selvedge denim jeans with a slim straight fit and chain-stitched hems.', images: [PRODUCT_IMAGES.jeans1], colors: ['Navy'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.6, reviews: 87, inStock: true, isNew: false, isFeatured: false, isTrending: false, tags: ['denim', 'jeans', 'selvedge'] },
    { name: 'Navigator Chronograph', slug: 'navigator-chronograph', price: 459.99, originalPrice: 549.99, category: 'accessories', brand: 'Eclipse', description: 'Pilot-inspired chronograph with a 42mm case, rotating bezel, and luminous dial.', images: [PRODUCT_IMAGES.watch2], colors: ['Black'], sizes: [], rating: 4.8, reviews: 28, inStock: true, isNew: true, isFeatured: false, isTrending: false, tags: ['watch', 'chronograph', 'pilot'] },
    { name: 'Canvas Backpack', slug: 'canvas-backpack', price: 129.99, originalPrice: null, category: 'bags', brand: 'Urban Pulse', description: 'Water-resistant waxed canvas backpack with leather accents and padded laptop sleeve.', images: [PRODUCT_IMAGES.bag2], colors: ['Black', 'Olive'], sizes: [], rating: 4.5, reviews: 156, inStock: true, isNew: false, isFeatured: false, isTrending: true, tags: ['backpack', 'canvas', 'laptop'] },
    { name: 'Classic Loafers', slug: 'classic-loafers', price: 219.99, originalPrice: null, category: 'footwear', brand: 'Velvet & Co', description: 'Hand-stitched penny loafers with a Blake construction and leather sole.', images: [PRODUCT_IMAGES.sneakers2], colors: ['Black', 'Camel'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.5, reviews: 43, inStock: true, isNew: false, isFeatured: false, isTrending: false, tags: ['loafers', 'leather', 'classic'] },
  ];

  const insertProduct = `INSERT INTO products (name, slug, price, original_price, category, brand, description, images, colors, sizes, rating, reviews_count, in_stock, is_new, is_featured, is_trending, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  for (const p of products) {
    runQuery(insertProduct, [
      p.name, p.slug, p.price, p.originalPrice || null,
      p.category, p.brand, p.description,
      JSON.stringify(p.images), JSON.stringify(p.colors), JSON.stringify(p.sizes),
      p.rating, p.reviews, p.inStock ? 1 : 0, p.isNew ? 1 : 0,
      p.isFeatured ? 1 : 0, p.isTrending ? 1 : 0, JSON.stringify(p.tags)
    ]);
  }
  console.log(`  ✓ ${products.length} products seeded`);

  // --- Seed Coupons ---
  const couponsData = [
    { code: 'LUXE10', type: 'percentage', value: 10, minOrder: 0 },
    { code: 'SAVE25', type: 'fixed', value: 25, minOrder: 200 },
    { code: 'FREESHIP', type: 'freeShipping', value: 0, minOrder: 0 },
    { code: 'WELCOME15', type: 'percentage', value: 15, minOrder: 50 },
  ];

  for (const c of couponsData) {
    runQuery(
      `INSERT INTO coupons (code, discount_type, discount_value, min_order, is_active) VALUES (?, ?, ?, ?, 1)`,
      [c.code, c.type, c.value, c.minOrder]
    );
  }
  console.log(`  ✓ ${couponsData.length} coupons seeded`);

  saveDbSync();
  console.log('✅ Database seeding complete!');
}

// Run directly if called as script
if (process.argv[1] && process.argv[1].includes('seed')) {
  seedDatabase().then(() => {
    console.log('Done.');
    process.exit(0);
  }).catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
