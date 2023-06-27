const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const db = require('./db');
const routes = require('./routes');

dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 2300;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs'); // Set EJS as the template engine

app.use('/', routes);

app.get('/', (req, res) => {
  db.ShortUrl.find({}, (err, shortUrls) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    res.render('combined', { shortUrls: shortUrls }); // Pass the shortUrls data to the template
  });
});

app.listen(PORT, () => {
  const ServerStatus = true;
  if (ServerStatus) {
    console.log(`Server is running on port ${PORT}`);
  } else {
    console.log('Unable to connect to the server');
  }
});
