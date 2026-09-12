# LuxeCart — Premium E-Commerce Platform (Inspired by EverShop)

A full-featured, premium e-commerce storefront built from scratch with enhanced UI/UX, inspired by EverShop's feature set but with a completely redesigned, modern, and stunning interface.

## Overview

Instead of cloning the EverShop monorepo (which requires PostgreSQL, complex setup, and has 100k+ lines of code), we'll build a standalone premium e-commerce app using **Vite + React** with all core e-commerce features, fully working client-side logic (localStorage-backed cart, checkout flow, filtering, search), and a stunning dark-mode-first design with glassmorphism, smooth animations, and premium typography.

**Brand Name**: **LuxeCart** — A premium fashion & lifestyle e-commerce store

## Key Features (Matching EverShop's core functionality)

### Storefront Pages
1. **Home Page** — Hero banner, featured collections, trending products, promo section, newsletter
2. **Product Listing / Category Page** — Grid/list views, filters (price, color, size, brand), sorting, pagination
3. **Product Detail Page** — Image gallery, variant selection (size/color), add to cart, reviews, related products
4. **Cart Page** — Line items, quantity update, remove items, coupon code, order summary
5. **Checkout Page** — Multi-step: Shipping info → Payment → Review & Place Order
6. **Order Confirmation** — Order summary, estimated delivery, order number
7. **Search Results** — Real-time search with highlighting
8. **Customer Account** — Login/Register, order history, profile settings

### Core Logic (Sanity Checked)
- Cart management (add, remove, update quantity) via React Context + localStorage
- Product filtering & sorting with proper state management
- Coupon code validation (demo codes: `LUXE10`, `SAVE20`, `FREESHIP`)
- Multi-step checkout with form validation
- Search with debounced input and result highlighting
- Wishlist functionality
- Product variant selection (size + color combos)
- Responsive design (mobile-first)

## Tech Stack
- **Vite + React** (fast dev, HMR)
- **React Router** for SPA navigation
- **Vanilla CSS** with CSS custom properties (design tokens)
- **Google Fonts** (Inter + Outfit)
- **Generated product images** via AI

## Design System
- **Dark mode first** with elegant light mode toggle
- **Glassmorphism** cards with backdrop-blur
- **Color Palette**: Deep navy (#0a0e27), Electric violet (#7c3aed), Warm gold (#f59e0b), Emerald (#10b981)
- **Micro-animations**: Hover lifts, skeleton loading, slide-in transitions, ripple effects
- **Premium typography**: Outfit for headings, Inter for body

## Proposed File Structure

```
d:\ISI Projects\ecom\
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css              # Design system + global styles
    ├── context/
    │   ├── CartContext.jsx
    │   ├── WishlistContext.jsx
    │   └── AuthContext.jsx
    ├── data/
    │   └── products.js        # Product catalog data
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   └── Layout.jsx
    │   ├── ui/
    │   │   ├── ProductCard.jsx
    │   │   ├── CartItem.jsx
    │   │   ├── SearchBar.jsx
    │   │   ├── FilterSidebar.jsx
    │   │   ├── Newsletter.jsx
    │   │   └── Toast.jsx
    │   └── sections/
    │       ├── HeroBanner.jsx
    │       ├── FeaturedProducts.jsx
    │       ├── Categories.jsx
    │       └── PromoBar.jsx
    └── pages/
        ├── Home.jsx
        ├── ProductList.jsx
        ├── ProductDetail.jsx
        ├── Cart.jsx
        ├── Checkout.jsx
        ├── OrderConfirmation.jsx
        ├── Search.jsx
        ├── Login.jsx
        └── Account.jsx
```

## Verification Plan

### Automated Tests
- Build verification: `npm run build` must succeed without errors
- Dev server must start: `npm run dev`

### Manual Verification
- All pages render correctly
- Cart add/remove/update works with localStorage persistence
- Checkout flow completes end-to-end
- Search returns relevant results
- Filters narrow product listing correctly
- Coupon codes apply discounts
- Responsive on mobile/tablet/desktop
- All animations smooth at 60fps
