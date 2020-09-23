const fs = require('fs');
const pool = require('../utils/pool');
const Studio = require('./studio');

describe('studios model tests', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('should insert to studios with insert', async() => {
    const studio = await Studio.insert({ name: 'paramount', city: 'Los Angeles', state: 'California', country: 'USA' });

    expect(studio).toEqual({ studioId: '1', name: 'paramount', city: 'Los Angeles', state: 'California', country: 'USA' });
  });

  it('should find a studio by id', async() => {
    const studio = await Studio.insert({ name: 'paramount', city: 'Los Angeles', state: 'California', country: 'USA' });

    const paramountStudio = await Studio.findById(studio.studioId);
    
    expect(studio).toEqual(paramountStudio);
  });

  it('should get all studios', )
});