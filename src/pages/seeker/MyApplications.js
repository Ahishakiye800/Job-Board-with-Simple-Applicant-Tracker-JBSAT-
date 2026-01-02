import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI } from '../../services/api';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import './MyApplications.css';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  // List of statuses to avoid code repetition
  const statuses = ['New', 'Reviewing', 'Shortlisted', 'Accepted', 'Rejected'];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationAPI.getMyApplications();
      setApplications(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch applications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'New': 'badge-info',
      'Reviewing': 'badge-warning',
      'Shortlisted': 'badge-primary',
      'Accepted': 'badge-success',
      'Rejected': 'badge-danger',
    };
    return statusClasses[status] || 'badge-info';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'New': '🆕',
      'Reviewing': '👀',
      'Shortlisted': '⭐',
      'Accepted': '✅',
      'Rejected': '❌',
    };
    return icons[status] || '📄';
  };

  const filteredApplications = filterStatus === 'all'
    ? applications
    : applications.filter(app => app.status === filterStatus);

  if (loading) {
    return <Loading message="Loading your applications..." />;
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Applications</h1>
            <p className="page-subtitle">
              Track the status of all your job applications
            </p>
          </div>
          <Link to="/jobs" className="btn btn-primary">
            🔍 Find More Jobs
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="card">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All ({applications.length})
            </button>
            {statuses.map(status => (
              <button
                key={status}
                className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
                onClick={() => setFilterStatus(status)}
              >
                {status} ({applications.filter(a => a.status === status).length})
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3 className="empty-state-title">
              {filterStatus === 'all'
                ? 'No applications yet'
                : `No applications with status: ${filterStatus}`}
            </h3>
            <p>
              {filterStatus === 'all'
                ? 'Start applying to jobs to see them here'
                : 'Try selecting a different filter'}
            </p>
            {filterStatus === 'all' && (
              <Link to="/jobs" className="btn btn-primary">
                Browse Jobs
              </Link>
            )}
          </div>
        ) : (
          <div className="applications-list">
            {filteredApplications.map((application) => (
              <div key={application.id} className="my-application-card">
                <div className="application-main">
                  <div className="application-icon">
                    {getStatusIcon(application.status)}
                  </div>

                  <div className="application-details">
                    <h3 className="application-title">{application.job_title}</h3>
                    
                    <div className="application-meta">
                      <span className="meta-item">
                        <strong>🏢 {application.company}</strong>
                      </span>
                      <span className="meta-item">📍 {application.location}</span>
                      <span className="badge badge-primary">{application.job_type}</span>
                    </div>

                    <div className="application-timeline">
                      <span className="timeline-item">
                        📅 Applied: {formatDate(application.created_at)}
                      </span>
                    </div>

                    {application.cover_letter && (
                      <details className="cover-letter-details">
                        <summary className="cover-letter-summary">
                          View Cover Letter
                        </summary>
                        <div className="cover-letter-content">
                          {application.cover_letter}
                        </div>
                      </details>
                    )}
                  </div>

                  <div className="application-status-section">
                    <span className={`badge badge-lg ${getStatusBadgeClass(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                </div>

                <div className="application-footer">
                  <a
                    href={application.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline"
                  >
                    📄 View Submitted Resume
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
