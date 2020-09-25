const pool = require('../utils/pool');

module.exports = class Review {
  reviewId;
  rating;
  reviewer;
  review;
  film;

  constructor(row) {
    this.reviewId = row.review_id;
    this.rating = row.rating;
    this.reviewer = row.reviewer;
    this.review = row.review;
    this.film = row.film;
  }

  static async insert(review) {
    const { rows } = await pool.query(
      'INSERT INTO reviews (rating, reviewer, review, film) VALUES ($1, $2, $3, $4) RETURNING *',
      [review.rating, review.reviewer, review.review, review.film]
    );

    return new Review(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      `SELECT reviews.review_id, reviews.rating, reviews.review, reviews.film
      FROM reviews 
      JOIN films ON reviews.film=films.film_id`
    );

    return rows.map(row => new Review(row));
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM reviews WHERE review_id=$1 RETURNING *',
      [id]
    );

    return new Review(rows[0]);
  }
};
