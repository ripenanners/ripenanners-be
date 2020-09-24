const fs = require('fs');
const pool = require('../lib/utils/pool');
const Film = require('../lib/models/film');
const Studio = require('../lib/models/studio');
const Actor = require('../lib/models/actor');
const request = require('supertest');
const app = require('../lib/app');

describe('film model tests', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it.only('should insert to film with insert', async() => {
    const newStudio = await Studio.insert({ name: 'paramount', city: 'Los Angeles', state: 'California', country: 'USA' });
    const actor1 = await Actor.insert({
      name: 'Patrick',
      dob: '8/10/84',
      pob: 'Military Base',
    });

    const actor2 = await Actor.insert({
      name: 'Josh 0.',
      dob: '8/10/80',
      pob: 'Disneyland',
    });
    const newFilm = await Film.insert({
      title: 'Sponge Bob meets Josh O.',
      release: '10/31/1989',
      studio: newStudio.studioId,
      actors: [
        { role: 'Sponge Bob', actor: actor1.actorId }, 
        { role: 'Josh O.', actor: actor2.actorId }
      ]
    });

    return request(app)
      .post('/api/v1/films')
      .send(newFilm)
      .then(res => {
        expect(res.body).toEqual({
          filmId: newFilm.filmId,
          title: 'Sponge Bob meets Josh O.',
          release: '10/31/1989',
          studio: newStudio.studioId,
          actors: [
            { role: 'Sponge Bob', actor: actor1.actorId }, 
            { role: 'Josh O.', actor: actor2.actorId }
          ]
        });
      });
  });

  it('should find a studio by id', async() => {
    const newFilm = await Film.insert({ title: 'paramount', release: 'Los Angeles', studio: 'California', cast: 'USA' });

    const response = await request(app)
      .get(`/api/v1/studios/${newFilm.filmId}`);
    
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
