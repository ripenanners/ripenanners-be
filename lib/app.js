const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/v1/studios', require('./controllers/studios'));
app.use('/api/v1/actors', require('./controllers/actors'));
app.use('/api/v1/reviewers', require('./controllers/reviewers'));
app.use('/api/v1/films', require('./controllers/films'));
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
