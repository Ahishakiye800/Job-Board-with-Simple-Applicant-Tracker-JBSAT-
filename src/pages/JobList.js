import React, { useState, useEffect } from 'react';
import { jobAPI } from '../services/api';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import './JobList.css';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    job_type: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getAllJobs(filters);
      setJobs(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch jobs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      location: '',
      job_type: '',
    });
    setTimeout(() => fetchJobs(), 0);
  };

  if (loading) {
    return <Loading message="Loading jobs..." />;
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Browse Jobs</h1>
          <p className="page-subtitle">
            Find your next opportunity from {jobs.length} available positions
          </p>
        </div>

        {/* Filters */}
        <div className="card filters-card">
          <form onSubmit={handleSearch} className="filters-form">
            <div className="filter-group">
              <input
                type="text"
                name="search"
                className="form-control"
                placeholder="Search by job title, company..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <input
                type="text"
                name="location"
                className="form-control"
                placeholder="Location"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <select
                name="job_type"
                className="form-control"
                value={filters.job_type}
                onChange={handleFilterChange}
              >
                <option value="">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Search
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="btn btn-secondary"
            >
              Clear
            </button>
          </form>
        </div>

        {/* Job List */}
        {jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3 className="empty-state-title">No jobs found</h3>
            <p>Try adjusting your filters or check back later for new opportunities</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;