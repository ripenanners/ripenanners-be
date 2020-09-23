const pool = require('../utils/pool');

module.exports = class Studio {
  studioId;
  name;
  city;
  state;
  country;

  constructor(row) {
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

};
