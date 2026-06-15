'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');

// Our Dependencies
const weather = require('./modules/weather.js');// Lab 8: ADD Weather Module
const movies = require('./modules/old-movies.js');// Lab 8: ADD Movie Module


// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());


// server.js is responsible for:
// - starting the server
// - registering routes
// - handling errors
// To simplify we novie the route logic like API requests, cache checks, and returns the data structure requested

app.get('/weather', weatherHandler);
app.get('/movies', handleMovies);// Lab 8: ADD Movie Route

// MUST BE LAST in routes list
app.use('/', notFoundHandler);

// Weather Handler
function weatherHandler(request, response) {
  const { lat, lon } = request.query;

  if (!lat || !lon) {
    return response.status(400).send("Missing lat/lon");
  }

  weather(Number(lat), Number(lon))
    .then(summaries => {
      response.send(summaries);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).send('Sorry. Something went wrong!');
    });
}

// LAB 8: Movie Handler async function
async function handleMovies(req, res) {
  try {
    const searchQuery = req.query.searchQuery;
    const movieResults = await movies(searchQuery);

    // Lab 8: Log the movie results to the console to see what we get back from the API
    console.log(movieResults);
    res.status(200).send(movieResults);

    // Lab 8: ADD error handling for the movie route
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting movie data');

  }
} 

// Not Found Handler
function notFoundHandler(request, response) {
  response.status(404).send('huh?');
}
// Turn on the server
app.listen(PORT, () => console.log(`Server up on ${PORT}`));