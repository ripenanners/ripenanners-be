const pool = require('../utils/pool');

module.exports = class Actor {
  actorId;
  name;
  dob;
  pob;

  constructor(row) {
    this.actorId = row.actor_id;
    this.name = row.name;
    this.dob = row.dob;
    this.pob = row.pob;
  }

  static async insert(actor) {
    const { rows } = await pool.query(
      'INSERT INTO actors (name, dob, pob) VALUES ($1, $2, $3) RETURNING *',
      [actor.name, actor.dob, actor.pob]
    );
    return new Actor(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM actors WHERE actor_id=$1',
      [id]
    );
    if(!rows[0]) return null;
    else return new Actor(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM actors'
    );

    return rows.map(row => new Actor(row));
  }
};
