
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

exports.submitApplication = async (req, res) => {
  try {
    const { job_id, cover_letter } = req.body;

    if (!job_id) {
      return res.status(400).json({
        success: false,
        error: 'Job ID is required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Resume file is required'
      });
    }

    const job = await Job.findById(job_id);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'This job is no longer accepting applications'
      });
    }

    const existingApplication = await Application.checkExisting(job_id, req.user.id);
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        error: 'You have already applied to this job'
      });
    }

    const user = await User.findById(req.user.id);

    const applicationData = {
      job_id,
      seeker_id: req.user.id,
      seeker_name: user.name,
      seeker_email: user.email,
      resume_url: req.file.path,
      cover_letter: cover_letter || null
    };

    const application = await Application.create(applicationData);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while submitting application'
    });
  }
};

exports.getSeekerApplications = async (req, res) => {
  try {
    const applications = await Application.findBySeekerId(req.user.id);

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get seeker applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching applications'
    });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    if (job.employer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view applications for this job'
      });
    }

    const applications = await Application.findByJobId(jobId);

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching applications'
    });
  }
};

exports.getEmployerApplications = async (req, res) => {
  try {
    const applications = await Application.findByEmployerId(req.user.id);

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get employer applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching applications'
    });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['New', 'Reviewing', 'Shortlisted', 'Rejected', 'Accepted'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    if (application.employer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this application'
      });
    }

    const updatedApplication = await Application.updateStatus(id, status);

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: updatedApplication
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating application status'
    });
  }
};

exports.getApplicationStats = async (req, res) => {
  try {
    const stats = await Application.getEmployerStats(req.user.id);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching statistics'
    });
  }
};
