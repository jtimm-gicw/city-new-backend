'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');

// Our Dependencies
// const weatherData = require('./data/weather.json');
// console.log(weatherData);
const weather = require('./modules/weather.js');
// const movies = require('./modules/movies.js');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());


app.get('/weather', weatherHandler);
// app.get('/movies', moviesHandler);

app.use('/', notFoundHandler);

function weatherHandler(request, response) {
  const { lat, lon } = request.query;

  weather(lat, lon)
    .then(summaries => {
      console.log("BACKEND OUTPUT:", summaries);
      console.log("IS ARRAY?", Array.isArray(summaries));

      response.send(summaries);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).send('Sorry. Something went wrong!');
    });
}

function notFoundHandler(request, response) {
  response.status(404).send('huh?');
}

app.listen(PORT, () => console.log(`Server up on ${PORT}`));