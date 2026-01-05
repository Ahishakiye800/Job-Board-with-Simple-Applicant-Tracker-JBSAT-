
import pool from '../config/database.js';


class Job {
  /**
   * Create a new job listing
   */
  static async create(jobData) {
    const query = `
      INSERT INTO jobs (
        employer_id, title, company, location, job_type, 
        description, requirements, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      jobData.employer_id,
      jobData.title,
      jobData.company,
      jobData.location,
      jobData.job_type,
      jobData.description,
      jobData.requirements,
      'active' // Default status to active on creation
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find all active jobs with optional filtering
   */
  static async findAll(filters = {}) {
    let query = `
      SELECT j.*, u.name as employer_name, u.email as employer_email
      FROM jobs j
      JOIN users u ON j.employer_id = u.id
      WHERE j.status = 'active'
    `;
    const values = [];
    let paramIndex = 1;

    if (filters.search) {
      query += ` AND (j.title ILIKE $${paramIndex} OR j.company ILIKE $${paramIndex} OR j.location ILIKE $${paramIndex})`;
      values.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters.location) {
      query += ` AND j.location ILIKE $${paramIndex}`;
      values.push(`%${filters.location}%`);
      paramIndex++;
    }

    if (filters.job_type) {
      query += ` AND j.job_type = $${paramIndex}`;
      values.push(filters.job_type);
      paramIndex++;
    }

    query += ' ORDER BY j.created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find a specific job by ID
   */
  static async findById(id) {
    const query = `
      SELECT j.*, u.name as employer_name, u.email as employer_email
      FROM jobs j
      JOIN users u ON j.employer_id = u.id
      WHERE j.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get all jobs belonging to a specific employer
   */
  static async findByEmployerId(employerId) {
    const query = `
      SELECT * FROM jobs 
      WHERE employer_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [employerId]);
    return result.rows;
  }

  /**
   * Update job details
   */
  static async update(id, jobData) {
    const query = `
      UPDATE jobs 
      SET 
        title = COALESCE($1, title),
        company = COALESCE($2, company),
        location = COALESCE($3, location),
        job_type = COALESCE($4, job_type),
        description = COALESCE($5, description),
        requirements = COALESCE($6, requirements),
        status = COALESCE($7, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;
    
    const values = [
      jobData.title,
      jobData.company,
      jobData.location,
      jobData.job_type,
      jobData.description,
      jobData.requirements,
      jobData.status,
      id
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete a job listing
   */
  static async delete(id) {
    const query = 'DELETE FROM jobs WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get comprehensive dashboard stats for an employer
   */
  static async getEmployerStats(employerId) {
    const query = `
      SELECT 
        COUNT(DISTINCT j.id) as total_jobs,
        COUNT(DISTINCT CASE WHEN j.status = 'active' THEN j.id END) as active_jobs,
        COUNT(DISTINCT CASE WHEN j.status = 'closed' THEN j.id END) as closed_jobs,
        COUNT(a.id) as total_applications,
        COUNT(CASE WHEN a.status = 'pending' THEN 1 END) as new_applications
      FROM jobs j
      LEFT JOIN applications a ON j.id = a.job_id
      WHERE j.employer_id = $1
    `;
    const result = await pool.query(query, [employerId]);
    return result.rows[0];
  }
}


export default Job;