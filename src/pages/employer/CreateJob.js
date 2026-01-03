import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './JobForm.css';

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'Full-time',
    description: '',
    requirements: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await jobAPI.createJob(formData);
      toast.success('Job posted successfully!');
      navigate('/employer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="form-container">
          <div className="page-header">
            <h1 className="page-title">Post a New Job</h1>
            <p className="page-subtitle">Fill in the details to create a job posting</p>
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
                <div className="form-help">
                  Provide a detailed description of the position
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Requirements <span className="text-danger">*</span>
                </label>
                <textarea
                  name="requirements"
                  className="form-control"
                  rows="5"
                  placeholder="List the qualifications, skills, and experience required..."
                  value={formData.requirements}
                  onChange={handleChange}
                />
                <div className="form-help">
                  List the qualifications and skills needed for this role
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? 'Posting Job...' : 'Post Job'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/employer/dashboard')}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;