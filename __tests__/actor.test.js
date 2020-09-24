const fs = require('fs');
const pool = require('../lib/utils/pool');
const Actor = require('../lib/models/actor');
const request = require('supertest');
const app = require('../lib/app');

describe('actors model tests', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('should insert to actors with insert', async() => {
    return request(app)
      .post('/api/v1/actors')
      .send({
        name: 'Johnny Five',
        dob: '8/10/83',
        pob: 'Military Base',
      })
      .then(res => {
        expect(res.body).toEqual({
          actorId: expect.any(String),
          name: 'Johnny Five',
          dob: '8/10/83',
          pob: 'Military Base',
        });
      });
  });

  it('should find a actor by id', async() => {
    const actor = await Actor.insert({
      name: 'Johnny Five',
      dob: '8/10/83',
      pob: 'Military Base',
    });

    const response = await request(app)
      .get(`/api/v1/actors/${actor.actorId}`);

    expect(response.body).toEqual(actor);
  });

  it('should get all actors', async() => {
    const actors = await Promise.all([
      {
        name: 'Johnny Five',
        dob: '8/10/83',
        pob: 'Military Base',
      },
      {
        name: 'Another Actor',
        dob: '8/12/93',
        pob: 'Somewhere',
      },
      {
        name: 'Yet Another Actor',
        dob: '2/2/73',
        pob: 'Nowhere',
      }
    ].map(actor => Actor.insert(actor)));

    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        actors.forEach(actor => {
          expect(res.body).toContainEqual(actor);
        });
      });
  });
});
