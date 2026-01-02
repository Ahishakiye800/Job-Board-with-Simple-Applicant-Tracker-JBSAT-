import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../../services/api';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import './ManageApplications.css';

const ManageApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  // Liste des statuts pour éviter les répétitions (DRY)
  const statuses = ['New', 'Reviewing', 'Shortlisted', 'Accepted', 'Rejected'];

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobRes, appsRes] = await Promise.all([
        jobAPI.getJobById(jobId),
        applicationAPI.getJobApplications(jobId),
      ]);

      setJob(jobRes.data.data);
      setApplications(appsRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch applications');
      navigate('/employer/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await applicationAPI.updateStatus(applicationId, newStatus);
      toast.success('Application status updated');
      
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      toast.error('Failed to update status');
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

  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  if (loading) {
    return <Loading message="Loading applications..." />;
  }

  return (
    <div className="page">
      <div className="container">
        {/* Job Info Header */}
        <div className="card job-info-card">
          <h2 className="job-info-title">{job?.title}</h2>
          <div className="job-info-meta">
            <span>🏢 {job?.company}</span>
            <span>📍 {job?.location}</span>
            <span className="badge badge-primary">{job?.job_type}</span>
          </div>
          <div className="job-info-stats">
            <strong>{applications.length}</strong> Total Applications
          </div>
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
            <h3 className="empty-state-title">No applications found</h3>
            <p>
              {filterStatus === 'all' 
                ? 'No one has applied to this job yet' 
                : `No applications with status: ${filterStatus}`}
            </p>
          </div>
        ) : (
          <div className="applications-grid">
            {filteredApplications.map((application) => (
              <div key={application.id} className="application-card">
                <div className="application-header">
                  <div>
                    <h3 className="applicant-name">{application.seeker_name}</h3>
                    <p className="applicant-email">📧 {application.seeker_email}</p>
                  </div>
                  <span className={`badge ${getStatusBadgeClass(application.status)}`}>
                    {application.status}
                  </span>
                </div>

                <div className="application-date">
                  Applied on: {formatDate(application.created_at)}
                </div>

                {application.cover_letter && (
                  <div className="cover-letter-section">
                    <h4 className="section-title">Cover Letter</h4>
                    <p className="cover-letter-text">{application.cover_letter}</p>
                  </div>
                )}

                <div className="application-actions">
                  {/* CORRECTION ICI : Ajout du "a" avant href */}
                  <a
                    href={application.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline"
                  >
                    📄 View Resume
                  </a>

                  <select
                    className="status-select"
                    value={application.status}
                    onChange={(e) => handleStatusChange(application.id, e.target.value)}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="back-button-container">
          <button
            onClick={() => navigate('/employer/dashboard')}
            className="btn btn-secondary"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageApplications;
