// 1. Change require to import (ensure the .js extension is present)
import pool from '../config/database.js';

class Application {
  // Create new application
  static async create(applicationData) {
    const query = `
      INSERT INTO applications (
        job_id, seeker_id, seeker_name, seeker_email, 
        resume_url, cover_letter, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      applicationData.job_id,
      applicationData.seeker_id,
      applicationData.seeker_name,
      applicationData.seeker_email,
      applicationData.resume_url,
      applicationData.cover_letter || null,
      'New'
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async checkExisting(jobId, seekerId) {
    const query = 'SELECT * FROM applications WHERE job_id = $1 AND seeker_id = $2';
    const result = await pool.query(query, [jobId, seekerId]);
    return result.rows[0];
  }

  static async findByJobId(jobId) {
    const query = `
      SELECT a.*, j.title as job_title, j.company
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.job_id = $1
      ORDER BY a.created_at DESC
    `;
    const result = await pool.query(query, [jobId]);
    return result.rows;
  }

  static async findBySeekerId(seekerId) {
    const query = `
      SELECT a.*, j.title as job_title, j.company, j.location, j.job_type
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.seeker_id = $1
      ORDER BY a.created_at DESC
    `;
    const result = await pool.query(query, [seekerId]);
    return result.rows;
  }

  static async findByEmployerId(employerId) {
    const query = `
      SELECT a.*, j.title as job_title, j.company
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.employer_id = $1
      ORDER BY a.created_at DESC
    `;
    const result = await pool.query(query, [employerId]);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT a.*, j.title as job_title, j.company, j.employer_id
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE applications 
      SET status = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async getEmployerStats(employerId) {
    const query = `
      SELECT 
        COUNT(*) as total_applications,
        COUNT(CASE WHEN a.status = 'New' THEN 1 END) as new_applications,
        COUNT(CASE WHEN a.status = 'Reviewing' THEN 1 END) as reviewing,
        COUNT(CASE WHEN a.status = 'Shortlisted' THEN 1 END) as shortlisted,
        COUNT(CASE WHEN a.status = 'Rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN a.status = 'Accepted' THEN 1 END) as accepted
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.employer_id = $1
    `;
    const result = await pool.query(query, [employerId]);
    return result.rows[0];
  }
}

// 2. Change module.exports to export default
export default Application;