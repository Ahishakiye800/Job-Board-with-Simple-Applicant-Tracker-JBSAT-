import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../../services/api';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import './EmployerDashboard.css';

const EmployerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [appStats, setAppStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [jobStatsRes, appStatsRes, jobsRes] = await Promise.all([
        jobAPI.getEmployerStats(),
        applicationAPI.getApplicationStats(),
        jobAPI.getMyJobs(),
      ]);

      setStats(jobStatsRes.data.data);
      setAppStats(appStatsRes.data.data);
      setRecentJobs(jobsRes.data.data.slice(0, 5)); // Show only 5 recent jobs
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
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
    });
  };

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Employer Dashboard</h1>
            <p className="page-subtitle">Manage your job postings and applications</p>
          </div>
          <Link to="/employer/create-job" className="btn btn-primary">
            + Post New Job
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.total_jobs || 0}</div>
              <div className="stat-label">Total Jobs</div>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.active_jobs || 0}</div>
              <div className="stat-label">Active Jobs</div>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon">📨</div>
            <div className="stat-content">
              <div className="stat-value">{appStats?.total_applications || 0}</div>
              <div className="stat-label">Total Applications</div>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon">🆕</div>
            <div className="stat-content">
              <div className="stat-value">{appStats?.new_applications || 0}</div>
              <div className="stat-label">New Applications</div>
            </div>
          </div>
        </div>

        {/* Application Status Breakdown */}
        <div className="card">
          <h3 className="card-title">Application Status Overview</h3>
          <div className="status-grid">
            <div className="status-item">
              <span className="badge badge-info">New</span>
              <span className="status-count">{appStats?.new_applications || 0}</span>
            </div>
            <div className="status-item">
              <span className="badge badge-warning">Reviewing</span>
              <span className="status-count">{appStats?.reviewing || 0}</span>
            </div>
            <div className="status-item">
              <span className="badge badge-primary">Shortlisted</span>
              <span className="status-count">{appStats?.shortlisted || 0}</span>
            </div>
            <div className="status-item">
              <span className="badge badge-success">Accepted</span>
              <span className="status-count">{appStats?.accepted || 0}</span>
            </div>
            <div className="status-item">
              <span className="badge badge-danger">Rejected</span>
              <span className="status-count">{appStats?.rejected || 0}</span>
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Job Postings</h3>
            <Link to="/employer/create-job" className="btn btn-sm btn-primary">
              View All
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3 className="empty-state-title">No job postings yet</h3>
              <p>Create your first job posting to start receiving applications</p>
              <Link to="/employer/create-job" className="btn btn-primary">
                Post a Job
              </Link>
            </div>
          ) : (
            <div className="jobs-list">
              {recentJobs.map((job) => (
                <div key={job.id} className="job-list-item">
                  <div className="job-list-info">
                    <h4 className="job-list-title">{job.title}</h4>
                    <div className="job-list-meta">
                      <span className="badge badge-primary">{job.job_type}</span>
                      <span>📍 {job.location}</span>
                      <span>📅 {formatDate(job.created_at)}</span>
                      <span className={`badge ${job.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                  <div className="job-list-actions">
                    <Link
                      to={`/employer/applications/${job.id}`}
                      className="btn btn-sm btn-outline"
                    >
                      View Applications
                    </Link>
                    <Link
                      to={`/employer/edit-job/${job.id}`}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;