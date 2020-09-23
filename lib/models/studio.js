const pool = require('../utils/pool');

module.exports = class Studio {
  studioId;
  city;
  state;
  name;
  country;

  constructor(row) {
    this.studioId = row.studio_id;
    this.city = row.city;
    this.state = row.state;
    this.name = row.name;
    this.country = row.country;

  }

  static async insert(studio) {
    const { rows } = await pool.query(

      'INSERT INTO studios (studio_id, city, state, name, country) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [studio.studioId, studio.city, studio.state, studio.name, studio.country]
    );
    return new Studio(rows[0]);
  }

};
