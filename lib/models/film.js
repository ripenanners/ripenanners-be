const pool = require('../utils/pool');

module.exports = class Film {
  filmId;
  title;
  release;
  studio;
  actors;

  constructor(row) {
    this.filmId = row.film_id;
    this.title = row.title;
    this.release = row.release;
    this.studio = row.studio;
    this.actors = row.actors;

  }

  static async insert(film) {
    const { rows } = await pool.query(
      'INSERT INTO films (title, release, studio, actors) VALUES ($1, $2, $3, $4) RETURNING *',
      [film.title, film.release, film.studio, film.actors]
    );
    return new Film(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM films WHERE film_id=$1',
      [id]
    );
    if(!rows[0]) return null;
    else return new Film(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM films'
    );

    return rows.map(row => new Film(row));
  }

};
