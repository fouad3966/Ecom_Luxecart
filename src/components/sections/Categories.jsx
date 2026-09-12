import { Link } from 'react-router-dom';
import { categories } from '../../data/products';
import './Categories.css';

const categoryData = [
  { id: 'clothing', label: 'Clothing', sub: 'Jackets, tees, dresses & more', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&h=650&fit=crop&q=80' },
  { id: 'footwear', label: 'Footwear', sub: 'Sneakers, boots & runners', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=650&fit=crop&q=80' },
  { id: 'accessories', label: 'Accessories', sub: 'Watches, shades & belts', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=650&fit=crop&q=80' },
  { id: 'bags', label: 'Bags', sub: 'Totes, weekenders & wallets', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=650&fit=crop&q=80' },
];

export default function Categories() {
  return (
    <section className="cat-section" id="shop-categories">
      <div className="container">
        <div className="cat-header">
          <span className="cat-eyebrow">Shop by category</span>
          <h2 className="cat-title">Find your thing.</h2>
        </div>

        <div className="cat-grid">
          {categoryData.map((cat, index) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="cat-card animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
              id={`category-${cat.id}`}
            >
              <div className="cat-card-img-wrap">
                <img src={cat.img} alt={cat.label} className="cat-card-img" loading="lazy" />
              </div>
              <div className="cat-card-info">
                <h3 className="cat-card-label">{cat.label}</h3>
                <span className="cat-card-sub">{cat.sub}</span>
                <span className="cat-card-link">Browse →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
