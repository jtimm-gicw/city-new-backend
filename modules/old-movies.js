'use strict';

// import the axios library to make API requests
const axios = require('axios');

// ======================================
// CACHE IMPORT
// ======================================
//
// We import a shared cache object from cache.js.
// This allows ALL routes in our backend to reuse the same memory store.
//
// WHY THIS MATTERS:
// - Without this, every file would have its own cache (not shared)
// - This creates a simple in-memory caching system for API responses
//
let cache = require('./cache.js') || {};
// let cache = {}; // 👉 fallback option (not recommended in multi-file apps)

/*
ROUTES FILE RESPONSIBILITY

This file contains all movie-related routes.

server.js is responsible for:
- starting the server
- registering routes
- handling errors

movies.js is responsible for:
- receiving movie requests
- checking the cache
- calling Movie API
- formatting the data
- sending the response

This keeps our code organized and easier to maintain.
*/

// ======================================
// MOVIE FETCH FUNCTION (WITH CACHE)
// ======================================

/*
STEP 1: Check cache BEFORE making API call

WHY:
- API calls are slow
- APIs often have rate limits
- caching improves performance dramatically
*/

async function getMovies(searchQuery) {

  // STEP 2: Create a unique cache key
  // WHY: each search term needs its own cached result
  const key = `movies-${searchQuery}`;

  // STEP 3: CHECK if data exists in cache AND is still fresh
  // We use a simple time-based expiration (50 seconds here)
  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {

    console.log('CACHE HIT - returning stored movie data');

    // Return cached data instead of calling API again
    return cache[key].data;
  }

  console.log('CACHE MISS - fetching from API');

  const url = `https://api.themoviedb.org/3/search/movie`;

  // STEP 4: Make API request ONLY if cache miss occurs
  const response = await axios.get(url, {
    params: {
      api_key: process.env.MOVIE_API_KEY,
      query: searchQuery
    }
  });

  // STEP 5: Transform raw API data into clean objects
  const parsedData = parseMovies(response.data);

  // STEP 6: STORE result in cache
  // WHY: next request for same query will be instant
  cache[key] = {
    timestamp: Date.now(),   // used for expiration logic
    data: parsedData         // stored cleaned movie data
  };

  return parsedData;
}

// ======================================
// DATA CLEANING FUNCTION
// ======================================

function parseMovies(movieData) {
  return movieData.results.map(movie => new Movie(movie));
}

// ======================================
// MOVIE CLASS (DATA MODEL)
// ======================================

// Lab 8: Create a Movie class to clean up the data we get back from the API
class Movie {
  constructor(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.average_votes = movie.vote_average;
    this.total_votes = movie.vote_count;

    this.image_url = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null;

    this.popularity = movie.popularity;
    this.released_on = movie.release_date;
  }
}

// Export function so server.js can use it
module.exports = getMovies;

