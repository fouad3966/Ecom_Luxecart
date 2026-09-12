import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import './Newsletter.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { success } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubmitted(true);
      success('Welcome! Check your inbox for 15% off.');
      setEmail('');
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <section className="nl-section" id="newsletter">
      <div className="container">
        <div className="nl-row">
          <div className="nl-text">
            <span className="nl-eyebrow">Stay in the loop</span>
            <h2 className="nl-title">Get 15% off your first order.</h2>
            <p className="nl-desc">
              New drops, exclusive offers, and style notes — delivered weekly. No spam, ever.
            </p>
          </div>

          <div className="nl-form-wrap">
            {submitted ? (
              <div className="nl-success animate-scale-in">
                <span>✓</span> You're in — check your inbox.
              </div>
            ) : (
              <form className="nl-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="nl-input"
                  required
                  id="newsletter-email"
                />
                <button type="submit" className="nl-btn">Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
