import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="header-container">
          <div className="logo">
            <span className="logo-icon"></span>
            <span className="logo-text">ComplaintHub</span>
          </div>
          <nav className="header-nav">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="header-actions">
            <Link to="/login" className="btn btn-outline">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-background">
          <div className="grid-pattern"></div>
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>
        <div className="hero-content">
          <div className="badge">Grievance Redressal Platform</div>
          <h1>Streamline Your <span>Complaint Management</span> Process</h1>
          <p>A transparent, efficient, and structured platform for managing and resolving complaints. Track status in real-time and ensure accountability.</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-large">Start Free Trial</Link>
            <Link to="/login" className="btn btn-outline btn-large">View Demo</Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Complaints Resolved</span>
            </div>
            <div className="stat">
              <span className="stat-number">99%</span>
              <span className="stat-label">Resolution Rate</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support Available</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="section-container">
          <div className="section-header">
            <h2>Powerful Features</h2>
            <p>Everything you need to manage complaints efficiently</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>Role-Based Access</h3>
              <p>Secure authentication with distinct roles for users, officers, and administrators with appropriate permissions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <h3>Real-Time Tracking</h3>
              <p>Monitor complaint status in real-time with instant updates and notifications at every stage.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20V10M18 20V4M6 20v-4"/>
                </svg>
              </div>
              <h3>Analytics Dashboard</h3>
              <p>Comprehensive analytics with charts for resolution time, categories, priorities, and performance metrics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3>Workflow Automation</h3>
              <p>Automated status transitions from pending to resolved with complete audit trail and history.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Officer Assignment</h3>
              <p>Assign complaints to specific officers, track responsibilities, and ensure accountability.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
              </div>
              <h3>Categorization</h3>
              <p>Organize complaints by type - infrastructure, service, harassment, billing, facilities, and more.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple and straightforward process</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Submit Complaint</h3>
                <p>Create a new complaint by filling out a simple form with title, description, category, and priority level.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>Review & Assign</h3>
                <p>Administrators review the complaint and assign it to an appropriate officer for handling.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Resolution Process</h3>
                <p>Officers work on the complaint, update status, and add comments throughout the process.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">04</div>
              <div className="step-content">
                <h3>Complaint Resolved</h3>
                <p>Once resolved, the complainant is notified and can view the complete history of their complaint.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of organizations using ComplaintHub to manage their grievance redressal system.</p>
          <Link to="/register" className="btn btn-primary btn-large">Create Free Account</Link>
        </div>
      </section>

      <footer id="contact" className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon"></span>
              <span className="logo-text">ComplaintHub</span>
            </div>
            <p>Efficient complaint management for modern organizations.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#about">About Us</a>
              <a href="#contact">Contact</a>
              <a href="#privacy">Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 ComplaintHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
