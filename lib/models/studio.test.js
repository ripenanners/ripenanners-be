const fs = require('fs');
const pool = require('../utils/pool');
const Studio = require('./studio');

describe('studios model tests', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('should insert to studios with insert', async() => {
    const studio = await Studio.insert({ name: 'paramount', city: 'Los Angeles', state: 'California', country: 'USA' });

    expect(studio).toEqual({ sudioId: studio.studio_id, name: 'paramount', city: 'Los Angeles', state: 'California', country: 'USA' });
  });
});