import React from 'react';
import { Link } from 'react-router-dom';
import './JobCard.css';

const JobCard = ({ job }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3 className="job-title">{job.title}</h3>
        <span className="badge badge-primary">{job.job_type}</span>
      </div>

      <div className="job-company">
        <span className="company-icon">🏢</span>
        {job.company}
      </div>

      <div className="job-location">
        <span className="location-icon">📍</span>
        {job.location}
      </div>


      <p className="job-description">
        {job.description.substring(0, 150)}...
      </p>

      <div className="job-card-footer">
        <span className="job-date">Posted: {formatDate(job.created_at)}</span>
        <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;