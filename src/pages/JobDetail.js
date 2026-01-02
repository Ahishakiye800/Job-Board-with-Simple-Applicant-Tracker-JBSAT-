import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isSeeker } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    cover_letter: '',
    resume: null,
  });

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobById(id);
      setJob(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF or Word document');
        e.target.value = '';
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        e.target.value = '';
        return;
      }

      setApplicationData({
        ...applicationData,
        resume: file,
      });
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    if (!applicationData.resume) {
      toast.error('Please upload your resume');
      return;
    }

    setApplying(true);

    try {
      const formData = new FormData();
      formData.append('job_id', id);
      formData.append('resume', applicationData.resume);
      if (applicationData.cover_letter) {
        formData.append('cover_letter', applicationData.cover_letter);
      }

      await applicationAPI.submitApplication(formData);
      toast.success('Application submitted successfully!');
      setShowApplicationForm(false);
      setApplicationData({ cover_letter: '', resume: null });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <Loading message="Loading job details..." />;
  }

  if (!job) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <h3>Job not found</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="job-detail-container">
          {/* Job Header */}
          <div className="card job-detail-header">
            <div className="job-header-content">
              <div>
                <h1 className="job-detail-title">{job.title}</h1>
                <div className="job-detail-meta">
                  <span className="meta-item">
                    <strong>🏢 {job.company}</strong>
                  </span>
                  <span className="meta-item">📍 {job.location}</span>
                  <span className="badge badge-primary">{job.job_type}</span>
                </div>
                {job.salary_range && (
                  <div className="job-salary-detail">
                    💰 {job.salary_range}
                  </div>
                )}
              </div>

              {isAuthenticated && isSeeker() && (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="btn btn-primary btn-lg"
                >
                  Apply Now
                </button>
              )}
            </div>

            <div className="job-posted-date">
              Posted on {formatDate(job.created_at)}
            </div>
          </div>

          {/* Application Form */}
          {showApplicationForm && isSeeker() && (
            <div className="card application-form-card">
              <h3 className="card-title">Submit Your Application</h3>
              <form onSubmit={handleSubmitApplication}>
                <div className="form-group">
                  <label className="form-label">
                    Cover Letter <span className="text-muted">(Optional)</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="Tell us why you're a great fit for this position..."
                    value={applicationData.cover_letter}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        cover_letter: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Resume <span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required
                  />
                  <div className="form-help">
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={applying}
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Job Description */}
          <div className="card">
            <h3 className="card-title">Job Description</h3>
            <div className="job-description">
              {job.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="card">
              <h3 className="card-title">Requirements</h3>
              <div className="job-requirements">
                {job.requirements.split('\n').map((req, index) => (
                  <p key={index}>{req}</p>
                ))}
              </div>
            </div>
          )}

          {/* Employer Info */}
          <div className="card">
            <h3 className="card-title">About the Employer</h3>
            <div className="employer-info">
              <p>
                <strong>Company:</strong> {job.company}
              </p>
              <p>
                <strong>Posted by:</strong> {job.employer_name}
              </p>
            </div>
          </div>

          {/* Login prompt for non-authenticated users */}
          {!isAuthenticated && (
            <div className="card login-prompt">
              <h3>Want to apply for this job?</h3>
              <p>Please login or create an account to submit your application</p>
              <div className="form-actions">
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-primary"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="btn btn-outline"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;