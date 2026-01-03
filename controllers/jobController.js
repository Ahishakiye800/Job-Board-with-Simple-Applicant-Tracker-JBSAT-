
const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  try {
    const { title, company, location, job_type, description, requirements } = req.body;

    if (!title || !company || !location || !job_type || !description) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    const jobData = {
      employer_id: req.user.id,
      title,
      company,
      location,
      job_type,
      description,
      requirements: requirements || null
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating job'
    });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      location: req.query.location,
      job_type: req.query.job_type
    };

    const jobs = await Job.findAll(filters);

    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching jobs'
    });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching job'
    });
  }
};

exports.getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.findByEmployerId(req.user.id);

    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Get employer jobs error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching jobs'
    });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const existingJob = await Job.findById(req.params.id);
    
    if (!existingJob) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    if (existingJob.employer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this job'
      });
    }

    const updatedJob = await Job.update(req.params.id, req.body);

    res.json({
      success: true,
      data: updatedJob
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating job'
    });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const existingJob = await Job.findById(req.params.id);
    
    if (!existingJob) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    if (existingJob.employer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this job'
      });
    }

    await Job.delete(req.params.id);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting job'
    });
  }
};

exports.getEmployerStats = async (req, res) => {
  try {
    const stats = await Job.getEmployerStats(req.user.id);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching statistics'
    });
  }
};
