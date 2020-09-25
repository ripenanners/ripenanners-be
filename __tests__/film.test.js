const fs = require('fs');
const pool = require('../lib/utils/pool');
const Film = require('../lib/models/film');
const Studio = require('../lib/models/studio');
const Actor = require('../lib/models/actor');
const request = require('supertest');
const app = require('../lib/app');
const seed = require('../data/seed');

describe('film model tests', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  beforeEach(() => {
    return seed();
  });

  

  it('should insert to film with insert', async() => {
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
          filmId: expect.any(String),
          title: 'Sponge Bob meets Josh O.',
          release: '10/31/1989',
          studio: newStudio.studioId,
          actors: expect.arrayContaining([
            { role: 'Sponge Bob', actor: actor1.actorId }, 
            { role: 'Josh O.', actor: actor2.actorId }
          ]) 
        });
      });
  });

  it('should find a film by id', async() => {
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

    const response = await request(app)
      .get(`/api/v1/films/${newFilm.filmId}`);
    
    expect(response.body).toEqual(newFilm);
  });

  it('should get all films', async() => {
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
   
    const films = await Promise.all([
      {
        title: 'Sponge Bob meets Josh O.',
        release: '10/31/1989',
        studio: newStudio.studioId,
        actors: [
          { role: 'Sponge Bob', actor: actor1.actorId }, 
          { role: 'Josh O.', actor: actor2.actorId }
        ]
      },
      {
        title: 'Star Wars',
        release: '10/31/1976',
        studio: newStudio.studioId,
        actors: [
          { role: 'Sponge Bob', actor: actor1.actorId }, 
          { role: 'Josh O.', actor: actor2.actorId }
        ]
      },
      {
        title: 'Josh Wars',
        release: '10/31/2000',
        studio: newStudio.studioId,
        actors: [
          { role: 'Sponge Bob', actor: actor1.actorId }, 
          { role: 'Josh O.', actor: actor2.actorId }
        ]
      }
    ].map(film => Film.insert(film)));

    return request(app)
      .get('/api/v1/films')
      .then(res => {;
        films.forEach(film => {
          expect(res.body).toContainEqual(film);
        });
      });
  });
});
