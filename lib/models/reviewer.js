const pool = require('../utils/pool');

module.exports = class Reviewer {
  reviewerId;
  name;
  company;

  constructor(row) {
    this.reviewerId = row.reviewer_id;
    this.name = row.name;
    this.company = row.company;
  }

  static async insert(reviewer) {
    const { rows } = await pool.query(
      'INSERT INTO reviewers (name, company) VALUES ($1, $2) RETURNING *',
      [reviewer.name, reviewer.city, reviewer.state, reviewer.country]
    );
    return new Reviewer(rows[0]);
  }

  static async findById(reviewerId) {
    const { rows } = await pool.query(
      'SELECT * FROM reviewers WHERE reviewer_id=$1',
      [reviewerId]
    );
    if (!rows[0]) return null;
    else return new Reviewer(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM reviewers'
    );

    return rows.map(row => new Reviewer(row));
  }

  static async update(reviewerId, reviewer) {
    const { rows } = await pool.query(
      `UPDATE reviewers 
        SET name=$1 company=$2
        WHERE reviewer_id=$3
        RETURNING *`,
      [reviewer.name, reviewer.company, reviewerId]
    );

    return new Reviewer(rows[0]);
  }

  static async delete(reviewerId) {
    const { rows } = await pool.query(
      `DELETE FROM reviewers
        WHERE reviewer_id=$1
        RETURNING *`,
        [reviewerId]
    );

    return new Reviewer(rows[0]);
  }
};