const { Router } = require('express');
const Review = require('../models/review');

module.exports = Router()
  .post('/', (req, res, next) => {
    Review
      .insert(req.body)
      .then(review => res.send(review))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Review
      .find()
      .then(reviews => res.send(reviews))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Review
      .delete(req.params.id)
      .then(review => res.send(review))
      .catch(next);
  });
