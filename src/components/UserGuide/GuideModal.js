import React from 'react';
import './GuideModal.css';

const GuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: '#2d3748' }}>User Guides</h2>
          <p style={{ color: '#718096' }}>Simple steps to use the platform effectively</p>
        </div>

        <div className="guides-container">
          {/* Carte Employeur */}
          <div className="guide-card">
            <div className="guide-icon">📝</div>
            <h3>How to Post a Job</h3>
            <ol>
              <li>Create an employer account</li>
              <li>Login to your dashboard</li>
              <li>Click <strong>Post a Job</strong></li>
              <li>Fill job details</li>
              <li>Publish the job</li>
            </ol>
          </div>

          {/* Carte Candidat */}
          <div className="guide-card">
            <div className="guide-icon">📤</div>
            <h3>How to Apply for a Job</h3>
            <ol>
              <li>Create a seeker account</li>
              <li>Login to your account</li>
              <li>Browse available jobs</li>
              <li>Click <strong>Apply</strong></li>
              <li>Upload resume & submit</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;