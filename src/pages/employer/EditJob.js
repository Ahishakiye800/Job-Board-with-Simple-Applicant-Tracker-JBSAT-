import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import './JobForm.css';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'Full-time',
    salary_range: '',
    description: '',
    requirements: '',
    status: 'active',
  });

  useEffect(() => {
    fetchJobData();
  }, [id]);

  const fetchJobData = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobById(id);
      const job = response.data.data;
      
      setFormData({
        title: job.title,
        company: job.company,
        location: job.location,
        job_type: job.job_type,
        salary_range: job.salary_range || '',
        description: job.description,
        requirements: job.requirements || '',
        status: job.status,
      });
    } catch (error) {
      toast.error('Failed to fetch job details');
      navigate('/employer/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await jobAPI.updateJob(id, formData);
      toast.success('Job updated successfully!');
      navigate('/employer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await jobAPI.deleteJob(id);
        toast.success('Job deleted successfully');
        navigate('/employer/dashboard');
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  if (loading) {
    return <Loading message="Loading job details..." />;
  }

  return (
    <div className="page">
      <div className="container">
        <div className="form-container">
          <div className="page-header">
            <h1 className="page-title">Edit Job Posting</h1>
            <p className="page-subtitle">Update the job details</p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Job Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Company Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  className="form-control"
                  placeholder="e.g., Tech Corp Inc."
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Location <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    placeholder="e.g., New York, NY"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Job Type <span className="text-danger">*</span>
                  </label>
                  <select
                    name="job_type"
                    className="form-control"
                    value={formData.job_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Salary Range <span className="text-muted">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="salary_range"
                    className="form-control"
                    placeholder="e.g., $80,000 - $120,000"
                    value={formData.salary_range}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Status <span className="text-danger">*</span>
                  </label>
                  <select
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Job Description <span className="text-danger">*</span>
                </label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="6"
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Requirements <span className="text-muted">(Optional)</span>
                </label>
                <textarea
                  name="requirements"
                  className="form-control"
                  rows="5"
                  placeholder="List the qualifications, skills, and experience required..."
                  value={formData.requirements}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Update Job'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/employer/dashboard')}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-danger"
                >
                  Delete Job
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJob;