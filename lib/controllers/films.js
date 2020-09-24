const { Router } = require('express');
const Film = require('../models/film');

module.exports = Router()
  .post('/', (req, res, next) => {
    Film
      .insert(req.body)
      .then(studio => res.send(studio))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Film
      .find()
      .then(studio => res.send(studio))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Film
      .findById(req.params.id)
      .then(studio => res.send(studio))
      .catch(next);
  });
