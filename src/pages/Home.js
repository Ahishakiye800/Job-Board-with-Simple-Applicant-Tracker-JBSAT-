import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GuideModal from '../components/UserGuide/GuideModal'; // Vérifie bien le chemin
import './Home.css';

const Home = () => {
  const { isAuthenticated, isEmployer, isSeeker } = useAuth();
  
  // État pour gérer l'ouverture de la modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find Your Dream Job or Hire Top Talent
            </h1>
            <p className="hero-subtitle">
              Connect employers with job seekers in a seamless, professional platform
            </p>
            
            <div className="hero-buttons">
              {/* Nouveau Bouton User Guide */}
              <button 
                className="btn btn-guide btn-lg" 
                onClick={() => setIsModalOpen(true)}
                style={{ marginRight: '10px', backgroundColor: '#3498db', color: 'white' }}
              >
                📖 User Guide
              </button>

              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Get Started
                  </Link>
                  <Link to="/jobs" className="btn btn-outline btn-lg">
                    Browse Jobs
                  </Link>
                </>
              ) : (
                <>
                  {isEmployer() && (
                    <>
                      <Link to="/employer/dashboard" className="btn btn-primary btn-lg">
                        Go to Dashboard
                      </Link>
                      <Link to="/employer/create-job" className="btn btn-outline btn-lg">
                        Post a Job
                      </Link>
                    </>
                  )}
                  {isSeeker() && (
                    <>
                      <Link to="/jobs" className="btn btn-primary btn-lg">
                        Browse Jobs
                      </Link>
                      <Link to="/seeker/applications" className="btn btn-outline btn-lg">
                        My Applications
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* La Modal (cachée par défaut) */}
      <GuideModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Easy Job Search</h3>
              <p className="feature-description">
                Find jobs that match your skills with powerful search and filters
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3 className="feature-title">Simple Applications</h3>
              <p className="feature-description">
                Apply to multiple jobs quickly with resume upload and tracking
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👔</div>
              <h3 className="feature-title">For Employers</h3>
              <p className="feature-description">
                Post jobs and manage applications efficiently in one place
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure & Private</h3>
              <p className="feature-description">
                Your data is protected with industry-standard security
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Fast & Responsive</h3>
              <p className="feature-description">
                Modern interface that works seamlessly on all devices
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Track Progress</h3>
              <p className="feature-description">
                Monitor your applications and hiring pipeline in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-subtitle">
              Join thousands of job seekers and employers today
            </p>
            {!isAuthenticated && (
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="btn btn-outline btn-lg"
                style={{ marginBottom: '20px', display: 'block', margin: '0 auto 20px' }}
              >
                View User Guide
              </button>
            )}
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;