const { Router } = require('express');
const Review = require('../models/review');

module.exports = Router()
  .post('/', (req, res, next) => {
    Review
      .insert(req.body)
      .then(review => res.send(review))
      .catch(next);
  });
