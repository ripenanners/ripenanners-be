const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const Review = require('../lib/models/review');
const Reviewer = require('../lib/models/reviewer');
const Studio = require('../lib/models/studio');
const Actor = require('../lib/models/actor');
const Film = require('../lib/models/film');
const app = require('../lib/app');
const _ = require('lodash');

describe('review routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('create a review', async() => {
    const reviewer = await Reviewer.insert({ name: 'sir', company: 'google' });

    const studio = await Studio.insert({ name: 'paramount', city: 'Los Angeles', state: 'California', country: 'USA' });

    const actors = await Promise.all([
      { name: 'Patrick', dob: '8/10/84', pob: 'Military Base' },
      { name: 'Josh 0.', dob: '8/10/80', pob: 'Disneyland' }
    ].map(actor => Actor.insert(actor)));

    const film = await Film.insert({
      title: 'Sponge Bob meets Josh O.',
      release: '10/31/1989',
      studio: studio.studioId,
      actors: [
        { role: 'Sponge Bob', actor: actors[0].actorId }, 
        { role: 'Josh O.', actor: actors[1].actorId }
      ]
    });

    return request(app)
      .post('/api/v1/reviews')
      .send({
        rating: 3,
        reviewer: reviewer.reviewerId,
        review: 'okay movie',
        film: film.filmId
      })
      .then(res => {
        expect(res.body).toEqual({
          reviewId: expect.any(String),
          rating: 3,
          reviewer: reviewer.reviewerId,
          review: 'okay movie',
          film: film.filmId
        });
      });
  });

  it('grab all reviews', async() => {
    const reviewer = await Reviewer.insert({ name: 'sir', company: 'google' });

    const studio = await Studio.insert({ name: 'paramount', city: 'Los Angeles', state: 'California', country: 'USA' });

    const actors = await Promise.all([
      { name: 'Patrick', dob: '8/10/84', pob: 'Military Base' },
      { name: 'Josh 0.', dob: '8/10/80', pob: 'Disneyland' }
    ].map(actor => Actor.insert(actor)));

    const films = await Promise.all([
      { title: 'Sponge Bob', release: '10/31/1989', studio: studio.studioId, actors: [{ role: 'SpongeBob', actor: actors[0].actorId }, { role: 'Josh O.', actor: actors[1].actorId }] },
      { title: 'Sponge Bob Josh O.', release: '10/31/1989', studio: studio.studioId, actors: [{ role: 'SpongeBob', actor: actors[0].actorId }, { role: 'Josh O.', actor: actors[1].actorId }] },
      { title: 'Sponge Bob meets Josh O.', release: '10/31/1989', studio: studio.studioId, actors: [{ role: 'SpongeBob', actor: actors[0].actorId }, { role: 'Josh O.', actor: actors[1].actorId }] }
    ].map(film => Film.insert(film)));

    const reviews = await Promise.all([
      { rating: 3, reviewer: reviewer.reviewerId, review: 'okay movie', film: films[0].filmId },
      { rating: 4, reviewer: reviewer.reviewerId, review: 'okay movie', film: films[1].filmId },
      { rating: 5, reviewer: reviewer.reviewerId, review: 'okay movie', film: films[2].filmId }
    ].map(review => Review.insert(review)));

    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        reviews.forEach(review => {
          expect(res.body).toContainEqual(_.pick(review, 'rating', 'review', 'film', 'reviewId'));
        });
      });
  });
});
