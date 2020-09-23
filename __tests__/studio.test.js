const fs = require('fs');
const pool = require('../lib/utils/pool');
const Studio = require('../lib/models/studio');
const request = require('supertest');
const app = require('../lib/app');

describe('studios model tests', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('should insert to studios with insert', async() => {
    const studio = await Studio.insert({ name: 'paramount', city: 'Los Angeles', state: 'California', country: 'USA' });

    return request(app)
      .post('/api/v1/studios')
      .send({
        studioId: studio.studioId,
        name: 'paramount',
        city: 'Los Angeles',
        state: 'California',
        country: 'USA'
      })
      .then(res => {
        expect(res.body).toEqual({
          studioId: expect.any(String),
          name: 'paramount',
          city: 'Los Angeles',
          state: 'California',
          country: 'USA'
        });
      });
  });

  it('should find a studio by id', async() => {
    const studio = await Studio.insert({ name: 'paramount', city: 'Los Angeles', state: 'California', country: 'USA' });

    const response = await request(app)
      .get(`/api/v1/studios/${studio.studioId}`);
    
    expect(response.body).toEqual(studio);
  });

  it('should get all studios', async() => {
    const studios = await Promise.all([
      { name: 'paramount', city: 'Los Angeles', state: 'California', country: 'USA' }, 
      { name: 'MGM', city: 'Los Angeles', state: 'California', country: 'USA' }, 
      { name: 'Disney', city: 'Hollywood', state: 'California', country: 'USA' }
    ].map(studio => Studio.insert(studio)));

    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        studios.forEach(studio => {
          expect(res.body).toContainEqual(studio);
        });
      });
  });
});
