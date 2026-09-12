import { Link } from 'react-router-dom';
import './InfoPages.css';

const faqs = [
  { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive a tracking number via email. You can also check your order status in your Account page under "My Orders".' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay. All transactions are securely encrypted.' },
  { q: 'How do I contact customer support?', a: 'You can reach us at support@luxecart.com or use the live chat feature available 9am–6pm EST, Monday through Friday.' },
  { q: 'Can I modify my order after placing it?', a: 'Orders can be modified within 1 hour of placement. After that, please contact our support team and we\'ll do our best to accommodate changes.' },
  { q: 'Do you ship internationally?', a: 'Yes! We ship to over 50 countries. International shipping rates are calculated at checkout based on destination and package weight.' },
];

export function HelpPage() {
  return (
    <div className="info-page">
      <div className="container">
        <div className="info-content">
          <span className="info-eyebrow">Support</span>
          <h1 className="info-title">Help Center</h1>
          <p className="info-intro">Find answers to commonly asked questions below. Can't find what you need? Email us at <strong>support@luxecart.com</strong></p>
          
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-question">{faq.q}</summary>
                <p className="faq-answer">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShippingPage() {
  return (
    <div className="info-page">
      <div className="container">
        <div className="info-content">
          <span className="info-eyebrow">Delivery</span>
          <h1 className="info-title">Shipping Information</h1>
          
          <div className="info-section">
            <h3>Domestic Shipping (US)</h3>
            <table className="info-table">
              <thead><tr><th>Method</th><th>Time</th><th>Cost</th></tr></thead>
              <tbody>
                <tr><td>Standard</td><td>5–7 business days</td><td>$9.99 (Free over $100)</td></tr>
                <tr><td>Express</td><td>2–3 business days</td><td>$19.99</td></tr>
                <tr><td>Overnight</td><td>1 business day</td><td>$34.99</td></tr>
              </tbody>
            </table>
          </div>

          <div className="info-section">
            <h3>International Shipping</h3>
            <p>We ship to 50+ countries. International orders typically arrive within 7–14 business days. Rates are calculated at checkout. Import duties and taxes may apply and are the responsibility of the recipient.</p>
          </div>

          <div className="info-section">
            <h3>Order Processing</h3>
            <p>Orders placed before 2pm EST on business days are processed the same day. Weekend and holiday orders are processed the next business day.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReturnsPage() {
  return (
    <div className="info-page">
      <div className="container">
        <div className="info-content">
          <span className="info-eyebrow">Policy</span>
          <h1 className="info-title">Returns & Exchanges</h1>
          
          <div className="info-section">
            <h3>30-Day Return Policy</h3>
            <p>We want you to love your purchase. If you're not completely satisfied, you can return any unworn, unwashed item with tags attached within 30 days of delivery for a full refund.</p>
          </div>

          <div className="info-section">
            <h3>How to Return</h3>
            <ol className="info-steps">
              <li>Log into your account and go to <Link to="/account">My Orders</Link></li>
              <li>Select the order and click "Start Return"</li>
              <li>Print the prepaid return label</li>
              <li>Pack items securely and drop off at any shipping location</li>
            </ol>
          </div>

          <div className="info-section">
            <h3>Exchanges</h3>
            <p>Need a different size or color? We recommend returning your original item and placing a new order to ensure availability. Exchanges are processed within 5 business days of receiving your return.</p>
          </div>

          <div className="info-section">
            <h3>Non-Returnable Items</h3>
            <p>For hygiene reasons, fragrances, underwear, and swimwear are final sale and cannot be returned or exchanged.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SizeGuidePage() {
  return (
    <div className="info-page">
      <div className="container">
        <div className="info-content">
          <span className="info-eyebrow">Fit</span>
          <h1 className="info-title">Size Guide</h1>
          <p className="info-intro">Use the charts below to find your perfect fit. When in doubt, size up — our relaxed cuts are designed to be comfortable.</p>

          <div className="info-section">
            <h3>Tops & Outerwear</h3>
            <table className="info-table">
              <thead><tr><th>Size</th><th>Chest (in)</th><th>Waist (in)</th><th>EU</th></tr></thead>
              <tbody>
                <tr><td>XS</td><td>34–36</td><td>28–30</td><td>44</td></tr>
                <tr><td>S</td><td>36–38</td><td>30–32</td><td>46</td></tr>
                <tr><td>M</td><td>38–40</td><td>32–34</td><td>48</td></tr>
                <tr><td>L</td><td>40–42</td><td>34–36</td><td>50</td></tr>
                <tr><td>XL</td><td>42–44</td><td>36–38</td><td>52</td></tr>
                <tr><td>XXL</td><td>44–46</td><td>38–40</td><td>54</td></tr>
              </tbody>
            </table>
          </div>

          <div className="info-section">
            <h3>Footwear</h3>
            <table className="info-table">
              <thead><tr><th>Size</th><th>US</th><th>EU</th><th>UK</th><th>CM</th></tr></thead>
              <tbody>
                <tr><td>S</td><td>7–8</td><td>40–41</td><td>6–7</td><td>25–26</td></tr>
                <tr><td>M</td><td>8.5–9.5</td><td>42–43</td><td>7.5–8.5</td><td>26.5–27.5</td></tr>
                <tr><td>L</td><td>10–11</td><td>44–45</td><td>9–10</td><td>28–29</td></tr>
                <tr><td>XL</td><td>11.5–12</td><td>46–47</td><td>10.5–11</td><td>29.5–30</td></tr>
              </tbody>
            </table>
          </div>

          <div className="info-section">
            <h3>How to Measure</h3>
            <p><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape level.</p>
            <p><strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.</p>
            <p><strong>Foot:</strong> Stand on a piece of paper, trace your foot, and measure the longest distance in cm.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
