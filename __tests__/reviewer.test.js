const fs = require('fs');
const pool = require('../lib/utils/pool');
const Reviewer = require('../lib/models/reviewer');
const request = require('supertest');
const app = require('../lib/app');

describe('reviewers model tests', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('should insert to reviewers with insert', async() => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({
        name: 'Mr. Reviewer',
        company: 'Reddit',
      })
      .then(res => {
        expect(res.body).toEqual({
          reviewerId: expect.any(String),
          name: 'Mr. Reviewer',
          company: 'Reddit',
        });
      });
  });

  it('should find a reviewer by id', async() => {
    const reviewer = await Reviewer.insert({
      name: 'Mr. Reviewer',
      company: 'Reddit',
    });

    const response = await request(app)
      .get(`/api/v1/reviewers/${reviewer.reviewerId}`);

    expect(response.body).toEqual(reviewer);
  });

  it('should get all reviewers', async() => {
    const reviewers = await Promise.all([
      {
        name: 'Mr. Reviewer',
        company: 'Reddit',
      },
      {
        name: 'Another Reviewer',
        company: 'CNN',
      },
      {
        name: 'Yet Another Reviewer',
        company: 'The Onion',
      }
    ].map(reviewer => Reviewer.insert(reviewer)));

    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        reviewers.forEach(reviewer => {
          expect(res.body).toContainEqual(reviewer);
        });
      });
  });
});
