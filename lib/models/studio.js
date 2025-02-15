const pool = require('../utils/pool');

module.exports = class Studio {
  studioId;
  name;
  city;
  state;
  country;

  constructor(row) {
    this.studioId = row.studio_id;
    this.name = row.name;
    this.city = row.city;
    this.state = row.state;
    this.country = row.country;

  }

  static async insert(studio) {
    const { rows } = await pool.query(
      'INSERT INTO studios (name, city, state, country) VALUES ($1, $2, $3, $4) RETURNING *',
      [studio.name, studio.city, studio.state, studio.country]
    );
    return new Studio(rows[0]);
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
