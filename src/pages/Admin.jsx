import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { adminApi } from '../api';
import './Admin.css';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isLoggedIn, isAdmin } = useAuth();
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0, avgOrderValue: 0 });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isLoggedIn, isAdmin, navigate]);

  // Fetch data
  const fetchDashboard = useCallback(async () => {
    try {
      const data = await adminApi.stats();
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await adminApi.products();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await adminApi.orders();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    async function load() {
      setLoading(true);
      await Promise.all([fetchDashboard(), fetchProducts(), fetchOrders()]);
      setLoading(false);
    }
    load();
  }, [isAdmin, fetchDashboard, fetchProducts, fetchOrders]);

  // Product form state
  const emptyForm = {
    name: '', slug: '', price: '', originalPrice: '', category: 'clothing',
    brand: '', description: '', images: [''], colors: [''], sizes: [],
    rating: 4.5, reviews: 0, inStock: true, isNew: false, isFeatured: false,
    isTrending: false, tags: [''],
  };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setForm({
      ...product,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      images: product.images.length > 0 ? product.images : [''],
      colors: product.colors.length > 0 ? product.colors : [''],
      tags: product.tags.length > 0 ? product.tags : [''],
    });
    setEditingProduct(product.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.brand || !form.description) {
      showError('Please fill in all required fields');
      return;
    }
    setSaving(true);

    const productData = {
      ...form,
      price: parseFloat(form.price) || 0,
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      images: form.images.filter(Boolean),
      colors: form.colors.filter(Boolean),
      tags: form.tags.filter(Boolean),
      rating: parseFloat(form.rating) || 4.5,
      reviews: parseInt(form.reviews) || 0,
    };

    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct, productData);
        success('Product updated successfully');
      } else {
        await adminApi.createProduct(productData);
        success('Product added successfully');
      }
      await fetchProducts();
      await fetchDashboard();
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      showError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id) => {
    setProductToDelete(id);
  };

  const executeDelete = async () => {
    if (!productToDelete) return;
    try {
      await adminApi.deleteProduct(productToDelete);
      success('Product deleted');
      await fetchProducts();
      await fetchDashboard();
      setProductToDelete(null);
    } catch (err) {
      showError(err.message || 'Failed to delete product');
    }
  };

  const updateOrderStatus = async (orderNumber, status) => {
    try {
      await adminApi.updateOrderStatus(orderNumber, status);
      success(`Order status updated to ${status}`);
      await fetchOrders();
      await fetchDashboard();
    } catch (err) {
      showError(err.message || 'Failed to update order status');
    }
  };

  const updateFormField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const updateArrayField = (field, index, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].map((v, i) => i === index ? value : v),
    }));
  };
  const addArrayField = (field) => setForm(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  const removeArrayField = (field, index) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const toggleSize = (size) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size],
    }));
  };

  if (!isAdmin) return null;

  if (loading) {
    return (
      <div className="admin-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-secondary)' }}>
          Loading admin panel...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-header">
            <Link to="/" className="admin-logo">
              <span className="logo-icon">◆</span>
              <span>LuxeCart</span>
            </Link>
            <span className="admin-badge">Admin</span>
          </div>

          <nav className="admin-nav">
            <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setShowForm(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              Dashboard
            </button>
            <button className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => { setActiveTab('products'); setShowForm(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              Products
            </button>
            <button className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => { setActiveTab('orders'); setShowForm(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              Orders
            </button>
          </nav>

          <div className="admin-sidebar-footer">
            <Link to="/" className="admin-nav-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
              Back to Store
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="admin-content animate-fade-in">
              <h1 className="admin-title">Dashboard</h1>
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <span className="admin-stat-icon">💰</span>
                  <div>
                    <span className="admin-stat-value">${stats.totalRevenue.toFixed(2)}</span>
                    <span className="admin-stat-label">Total Revenue</span>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <span className="admin-stat-icon">📦</span>
                  <div>
                    <span className="admin-stat-value">{stats.totalOrders}</span>
                    <span className="admin-stat-label">Total Orders</span>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <span className="admin-stat-icon">🏷️</span>
                  <div>
                    <span className="admin-stat-value">{stats.totalProducts}</span>
                    <span className="admin-stat-label">Products</span>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <span className="admin-stat-icon">📊</span>
                  <div>
                    <span className="admin-stat-value">${stats.avgOrderValue.toFixed(2)}</span>
                    <span className="admin-stat-label">Avg. Order Value</span>
                  </div>
                </div>
              </div>

              <div className="admin-section">
                <h2 className="admin-section-title">Recent Orders</h2>
                {orders.length > 0 ? (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
                      <tbody>
                        {orders.slice(0, 5).map(order => (
                          <tr key={order.id}>
                            <td className="admin-order-id">{order.id}</td>
                            <td>{order.customer?.firstName} {order.customer?.lastName}</td>
                            <td>{new Date(order.date).toLocaleDateString()}</td>
                            <td className="admin-order-total">${order.total.toFixed(2)}</td>
                            <td><span className={`badge badge-${order.status === 'delivered' ? 'emerald' : order.status === 'cancelled' ? 'rose' : 'gold'}`}>{order.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="admin-empty-text">No orders yet. Orders will appear here when customers check out.</p>
                )}
              </div>
            </div>
          )}

          {/* Products */}
          {activeTab === 'products' && !showForm && (
            <div className="admin-content animate-fade-in">
              <div className="admin-content-header">
                <h1 className="admin-title">Products ({products.length})</h1>
                <button className="btn btn-primary" onClick={openAddForm} id="add-product-btn">
                  + Add Product
                </button>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div className="admin-product-cell">
                            <img src={product.images[0]} alt={product.name} className="admin-product-thumb" />
                            <div>
                              <span className="admin-product-name">{product.name}</span>
                              <span className="admin-product-brand">{product.brand}</span>
                            </div>
                          </div>
                        </td>
                        <td className="admin-cap">{product.category}</td>
                        <td className="admin-price">${product.price.toFixed(2)}</td>
                        <td>{product.inStock ? <span className="badge badge-emerald">In Stock</span> : <span className="badge badge-rose">Out</span>}</td>
                        <td>
                          <div className="admin-status-flags">
                            {product.isNew && <span className="badge badge-violet">New</span>}
                            {product.isFeatured && <span className="badge badge-gold">Featured</span>}
                            {product.isTrending && <span className="badge badge-rose">Trending</span>}
                          </div>
                        </td>
                        <td>
                          {productToDelete === product.id ? (
                            <div className="admin-actions" style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                              <button className="btn btn-primary btn-sm" onClick={executeDelete} style={{ background: 'var(--rose)', border: 'none', padding: '4px 8px', fontSize: '12px' }}>Confirm</button>
                              <button className="btn btn-ghost btn-sm" onClick={() => setProductToDelete(null)} style={{ padding: '4px 8px', fontSize: '12px' }}>Cancel</button>
                            </div>
                          ) : (
                            <div className="admin-actions">
                              <button className="admin-action-btn" onClick={() => openEditForm(product)} title="Edit">✏️</button>
                              <button className="admin-action-btn admin-delete-btn" onClick={() => confirmDelete(product.id)} title="Delete">🗑️</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Product Form (Add/Edit) */}
          {activeTab === 'products' && showForm && (
            <div className="admin-content animate-fade-in">
              <div className="admin-content-header">
                <h1 className="admin-title">{editingProduct ? 'Edit Product' : 'Add New Product'}</h1>
                <button className="btn btn-ghost" onClick={() => setShowForm(false)}>← Back to Products</button>
              </div>

              <form className="admin-form" onSubmit={handleSubmit} id="product-form">
                <div className="admin-form-grid">
                  {/* Left Column */}
                  <div className="admin-form-section">
                    <h3 className="admin-form-section-title">Basic Information</h3>

                    <div className="input-group">
                      <label className="input-label">Product Name *</label>
                      <input className="input-field" value={form.name} onChange={e => updateFormField('name', e.target.value)} placeholder="e.g. Premium Leather Jacket" disabled={saving} />
                    </div>

                    <div className="input-group">
                      <label className="input-label">URL Slug</label>
                      <input className="input-field" value={form.slug} onChange={e => updateFormField('slug', e.target.value)} placeholder="auto-generated-from-name" disabled={saving} />
                    </div>

                    <div className="admin-form-row">
                      <div className="input-group">
                        <label className="input-label">Price *</label>
                        <input className="input-field" type="number" step="0.01" value={form.price} onChange={e => updateFormField('price', e.target.value)} placeholder="99.99" disabled={saving} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Original Price</label>
                        <input className="input-field" type="number" step="0.01" value={form.originalPrice} onChange={e => updateFormField('originalPrice', e.target.value)} placeholder="Optional — for sale items" disabled={saving} />
                      </div>
                    </div>

                    <div className="admin-form-row">
                      <div className="input-group">
                        <label className="input-label">Category *</label>
                        <select className="input-field" value={form.category} onChange={e => updateFormField('category', e.target.value)} disabled={saving}>
                          <option value="clothing">Clothing</option>
                          <option value="footwear">Footwear</option>
                          <option value="accessories">Accessories</option>
                          <option value="bags">Bags</option>
                          <option value="fragrance">Fragrance</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Brand *</label>
                        <input className="input-field" value={form.brand} onChange={e => updateFormField('brand', e.target.value)} placeholder="e.g. Noir Studio" disabled={saving} />
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Description *</label>
                      <textarea className="input-field admin-textarea" value={form.description} onChange={e => updateFormField('description', e.target.value)} placeholder="Describe the product..." rows={4} disabled={saving} />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="admin-form-section">
                    <h3 className="admin-form-section-title">Media & Variants</h3>

                    <div className="input-group">
                      <label className="input-label">Image URLs</label>
                      {form.images.map((img, i) => (
                        <div key={i} className="admin-array-row">
                          <input className="input-field" value={img} onChange={e => updateArrayField('images', i, e.target.value)} placeholder="https://..." disabled={saving} />
                          {form.images.length > 1 && <button type="button" className="admin-array-remove" onClick={() => removeArrayField('images', i)}>×</button>}
                        </div>
                      ))}
                      <button type="button" className="admin-array-add" onClick={() => addArrayField('images')}>+ Add image URL</button>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Colors</label>
                      {form.colors.map((color, i) => (
                        <div key={i} className="admin-array-row">
                          <input className="input-field" value={color} onChange={e => updateArrayField('colors', i, e.target.value)} placeholder="e.g. Black" disabled={saving} />
                          {form.colors.length > 1 && <button type="button" className="admin-array-remove" onClick={() => removeArrayField('colors', i)}>×</button>}
                        </div>
                      ))}
                      <button type="button" className="admin-array-add" onClick={() => addArrayField('colors')}>+ Add color</button>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Sizes</label>
                      <div className="admin-size-grid">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                          <button
                            key={size}
                            type="button"
                            className={`admin-size-btn ${form.sizes.includes(size) ? 'active' : ''}`}
                            onClick={() => toggleSize(size)}
                            disabled={saving}
                          >{size}</button>
                        ))}
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Tags</label>
                      {form.tags.map((tag, i) => (
                        <div key={i} className="admin-array-row">
                          <input className="input-field" value={tag} onChange={e => updateArrayField('tags', i, e.target.value)} placeholder="e.g. leather" disabled={saving} />
                          {form.tags.length > 1 && <button type="button" className="admin-array-remove" onClick={() => removeArrayField('tags', i)}>×</button>}
                        </div>
                      ))}
                      <button type="button" className="admin-array-add" onClick={() => addArrayField('tags')}>+ Add tag</button>
                    </div>

                    <h3 className="admin-form-section-title" style={{ marginTop: 'var(--space-6)' }}>Flags</h3>
                    <div className="admin-toggle-group">
                      <label className="admin-toggle"><input type="checkbox" checked={form.inStock} onChange={e => updateFormField('inStock', e.target.checked)} disabled={saving} /><span className="admin-toggle-slider" /><span>In Stock</span></label>
                      <label className="admin-toggle"><input type="checkbox" checked={form.isNew} onChange={e => updateFormField('isNew', e.target.checked)} disabled={saving} /><span className="admin-toggle-slider" /><span>New</span></label>
                      <label className="admin-toggle"><input type="checkbox" checked={form.isFeatured} onChange={e => updateFormField('isFeatured', e.target.checked)} disabled={saving} /><span className="admin-toggle-slider" /><span>Featured</span></label>
                      <label className="admin-toggle"><input type="checkbox" checked={form.isTrending} onChange={e => updateFormField('isTrending', e.target.checked)} disabled={saving} /><span className="admin-toggle-slider" /><span>Trending</span></label>
                    </div>
                  </div>
                </div>

                <div className="admin-form-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)} disabled={saving}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-lg" id="save-product-btn" disabled={saving}>
                    {saving ? 'Saving...' : (editingProduct ? 'Save Changes' : 'Add Product')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="admin-content animate-fade-in">
              <h1 className="admin-title">Orders</h1>
              {orders.length > 0 ? (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td className="admin-order-id">{order.id}</td>
                          <td>{order.customer?.firstName} {order.customer?.lastName}</td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>
                            <div className="admin-order-items">
                              {order.items.slice(0, 2).map(item => (
                                <img key={item.itemKey || item.id} src={item.image} alt={item.name} className="admin-order-item-thumb" />
                              ))}
                              {order.items.length > 2 && <span className="admin-order-more">+{order.items.length - 2}</span>}
                            </div>
                          </td>
                          <td className="admin-order-total">${order.total.toFixed(2)}</td>
                          <td>
                            <select
                              className="input-field"
                              value={order.status}
                              onChange={e => updateOrderStatus(order.id, e.target.value)}
                              style={{ minWidth: '120px', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="admin-empty-text">No orders yet. Place an order from the storefront to see it here.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
