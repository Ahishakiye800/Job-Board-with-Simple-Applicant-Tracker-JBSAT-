import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI } from '../../services/api';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import './SeekerDashboard.css';

const SeekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusStats = () => {
    return {
      total: applications.length,
      new: applications.filter(a => a.status === 'New').length,
      reviewing: applications.filter(a => a.status === 'Reviewing').length,
      shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
      accepted: applications.filter(a => a.status === 'Accepted').length,
      rejected: applications.filter(a => a.status === 'Rejected').length,
    };
  };

  const stats = getStatusStats();

  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Job Seeker Dashboard</h1>
            <p className="page-subtitle">Track your job applications and search for new opportunities</p>
          </div>
          <Link to="/jobs" className="btn btn-primary">
            🔍 Browse Jobs
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Applications</div>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon">🆕</div>
            <div className="stat-content">
              <div className="stat-value">{stats.new}</div>
              <div className="stat-label">New</div>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon">👀</div>
            <div className="stat-content">
              <div className="stat-value">{stats.reviewing}</div>
              <div className="stat-label">Under Review</div>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-value">{stats.shortlisted}</div>
              <div className="stat-label">Shortlisted</div>
            </div>
          </div>
        </div>

        {/* Application Status Breakdown */}
        <div className="card">
          <h3 className="card-title">Application Status Overview</h3>
          <div className="status-grid">
            <div className="status-item">
              <span className="badge badge-info">New</span>
              <span className="status-count">{stats.new}</span>
            </div>
            <div className="status-item">
              <span className="badge badge-warning">Reviewing</span>
              <span className="status-count">{stats.reviewing}</span>
            </div>
            <div className="status-item">
              <span className="badge badge-primary">Shortlisted</span>
              <span className="status-count">{stats.shortlisted}</span>
            </div>
            <div className="status-item">
              <span className="badge badge-success">Accepted</span>
              <span className="status-count">{stats.accepted}</span>
            </div>
            <div className="status-item">
              <span className="badge badge-danger">Rejected</span>
              <span className="status-count">{stats.rejected}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="card-title">Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/jobs" className="action-card">
              <div className="action-icon">🔍</div>
              <div className="action-content">
                <h4>Browse Jobs</h4>
                <p>Find new job opportunities</p>
              </div>
            </Link>

            <Link to="/seeker/applications" className="action-card">
              <div className="action-icon">📋</div>
              <div className="action-content">
                <h4>My Applications</h4>
                <p>View all your applications</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Applications */}
        {applications.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3 className="empty-state-title">No applications yet</h3>
              <p>Start applying to jobs to track your progress here</p>
              <Link to="/jobs" className="btn btn-primary">
                Browse Available Jobs
              </Link>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Applications</h3>
              <Link to="/seeker/applications" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
            <div className="recent-applications">
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="application-preview">
                  <div className="application-preview-info">
                    <h4 className="application-job-title">{app.job_title}</h4>
                    <p className="application-company">🏢 {app.company}</p>
                  </div>
                  <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
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

export default SeekerDashboard;