import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Search from './pages/Search';
import Login from './pages/Login';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import Admin from './pages/Admin';
import { HelpPage, ShippingPage, ReturnsPage, SizeGuidePage } from './pages/InfoPages';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <Routes>
                {/* Admin — separate layout (no header/footer) */}
                <Route path="/admin" element={<Admin />} />

                {/* Storefront — with header/footer layout */}
                <Route path="*" element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<ProductList />} />
                      <Route path="/product/:slug" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/shipping" element={<ShippingPage />} />
                      <Route path="/returns" element={<ReturnsPage />} />
                      <Route path="/size-guide" element={<SizeGuidePage />} />
                    </Routes>
                  </Layout>
                } />
              </Routes>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
