import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isEmployer, isSeeker } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          💼 JobBoard
        </Link>

        <div className="navbar-menu">
          <Link to="/jobs" className="navbar-link">
            Browse Jobs
          </Link>

          {isAuthenticated ? (
            <>
              {isEmployer() && (
                <>
                  <Link to="/employer/dashboard" className="navbar-link">
                    Dashboard
                  </Link>
                  <Link to="/employer/create-job" className="navbar-link">
                    Post Job
                  </Link>
                </>
              )}

              {isSeeker() && (
                <>
                  <Link to="/seeker/dashboard" className="navbar-link">
                    Dashboard
                  </Link>
                  <Link to="/seeker/applications" className="navbar-link">
                    My Applications
                  </Link>
                </>
              )}

              <div className="navbar-user">
                <span className="navbar-username">👤 {user.name}</span>
                <button onClick={handleLogout} className="btn btn-sm btn-outline">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;