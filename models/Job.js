
const pool = require('../config/database');

class Job {
  static async create(jobData) {
    const query = `
      INSERT INTO jobs (
        employer_id, title, company, location, job_type, 
        salary_range, description, requirements
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
      jobData.salary_range,
      jobData.description,
      jobData.requirements
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

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

  static async findByEmployerId(employerId) {
    const query = `
      SELECT * FROM jobs 
      WHERE employer_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [employerId]);
    return result.rows;
  }

  static async update(id, jobData) {
    const query = `
      UPDATE jobs 
      SET 
        title = COALESCE($1, title),
        company = COALESCE($2, company),
        location = COALESCE($3, location),
        job_type = COALESCE($4, job_type),
        salary_range = COALESCE($5, salary_range),
        description = COALESCE($6, description),
        requirements = COALESCE($7, requirements),
        status = COALESCE($8, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `;
    
    const values = [
      jobData.title,
      jobData.company,
      jobData.location,
      jobData.job_type,
      jobData.salary_range,
      jobData.description,
      jobData.requirements,
      jobData.status,
      id
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM jobs WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getEmployerStats(employerId) {
    const query = `
      SELECT 
        COUNT(*) as total_jobs,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_jobs,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_jobs
      FROM jobs
      WHERE employer_id = $1
    `;
    const result = await pool.query(query, [employerId]);
    return result.rows[0];
  }
}

module.exports = Job;
