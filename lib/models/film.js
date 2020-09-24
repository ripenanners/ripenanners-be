const pool = require('../utils/pool');

module.exports = class Film {
  filmId;
  title;
  release;
  studio;
  cast;

  constructor(row) {
    this.filmId = row.film_id;
    this.title = row.title;
    this.release = row.release;
    this.studio = row.studio;
    this.cast = row.cast;

  }

  static async insert(film) {
    const { rows } = await pool.query(
      'INSERT INTO studios (title, release, studio, cast) VALUES ($1, $2, $3, $4) RETURNING *',
      [film.title, film.release, film.studio, film.cast]
    );
    return new Film(rows[0]);
  }

  static async findById(studioId) {
    const { rows } = await pool.query(
      'SELECT * FROM studios WHERE studio_id=$1',
      [studioId]
    );
    if(!rows[0]) return null;
    else return new Studio(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM studios'
    );

    return rows.map(row => new Studio(row));
  }

};
