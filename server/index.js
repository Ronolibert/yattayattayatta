const path = require('path');
const express = require('express');
const nconf = require('nconf');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('./init');
const app = express();

const rootDir = path.join(__dirname, '../');

app.set('port', nconf.get('PORT') || 5000);

mongoose
  .connect(
    nconf.get('mongoURI'),
    { useNewUrlParser: true },
  )
  .then(() => {
    console.log('connected to mongo');
  });

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'build/index.html'));
});

app.listen(nconf.get('PORT'), () => {
  console.log(`Running in ${process.env.NODE_ENV}`);
  console.log(`Listening on port: ${nconf.get('PORT')}`);
});
