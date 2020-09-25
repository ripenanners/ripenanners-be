const Review = require('../lib/models/review');
const Reviewer = require('../lib/models/reviewer');
const Studio = require('../lib/models/studio');
const Actor = require('../lib/models/actor');
const Film = require('../lib/models/film');

const chance = require('chance').Chance();

module.exports = async({ studioCount = 10 } = {}) => {
  const studiosToCreate = [...Array(studioCount)]
    .map(() => (
      {
        name: chance.company() + ' Studios',
        city: chance.city(),
        state: chance.state({ country: 'us' }),
        country: 'USA'
      }
    )
    );

  await Promise.all(studiosToCreate.map(review => Studio.insert(review)));
};

module.exports = async({ actorsCount = 30 } = {}) => {
  const actorsToCreate = [...Array(actorsCount)]
    .map(() => (
      {
        name: chance.first() + ' ' + chance.last(),
        dob: chance.birthday({ string: true }),
        pob: chance.city() + ' ' + chance.state({ country: 'us' })
      }
    )
    );

  await Promise.all(actorsToCreate.map(review => Actor.insert(review)));
};

module.exports = async({ reviewersCount = 15 } = {}) => {
  const reviewersToCreate = [...Array(reviewersCount)]
    .map(() => (
      {
        name: chance.first() + ' ' + chance.last(),
        company: chance.company() + ' Review Company'
      }
    )
    );

  await Promise.all(reviewersToCreate.map(review => Reviewer.insert(review)));
};

module.exports = async({ reviewCount = 100 } = {}) => {
  const reviewsToCreate = [...Array(reviewCount)]
    .map(() => (
      {
        rating: chance.integer({ min: 2, max: 5 }),
        reviewer: chance.integer({ min: 1, max: 15 }),
        review: 'review: ' + chance.paragraph({ sentences: 2 }),
        film: chance.integer({ min: 1, max: 150 })
      }
    )
    );

  await Promise.all(reviewsToCreate.map(review => Review.insert(review)));
};

module.exports = async({ lowreviewCount = 50 } = {}) => {
  const lowreviewsToCreate = [...Array(lowreviewCount)]
    .map(() => (
      {
        rating: 1,
        reviewer: chance.integer({ min: 1, max: 15 }),
        review: 'review: ' + chance.paragraph({ sentences: 2 }),
        film: chance.integer({ min: 1, max: 50 })
      }
    )
    );

  await Promise.all(lowreviewsToCreate.map(review => Review.insert(review)));
};

module.exports = async({ filmCount = 50 } = {}) => {
  const filmsToCreate = [...Array(filmCount)]
    .map(() => (
      {
        title: chance.first() + ' movie title',
        release: chance.birthday({ type: 'child' }),
        studio: chance.integer({ min: 1, max: 10 }),
        actors: chance.integer({ min: 1, max: 30 })
      })
    );

  await Promise.all(filmsToCreate.map(review => Film.insert(review)));
};




// studios: 10x
// actors: 30x
// reviewers: 15x
// films: 150
// reviews:100x
// low reviews: 50x

// 1. Work on chance first
// 2. Films - We have to use JOIN
// 3. Actors - We have to use JOIN
// 4. Studios - We have to use JOIN
// 5. DELETE specifics
// 6. Deploy to Heroku




