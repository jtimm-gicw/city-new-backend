'use strict';

const axios = require('axios');

async function getMovies(searchQuery) {
  const url = `https://api.themoviedb.org/3/search/movie`;

  const response = await axios.get(url, {
    params: {
      api_key: process.env.MOVIE_API_KEY,
      query: searchQuery
    }
  });

  return parseMovies(response.data);
}

function parseMovies(movieData) {
  return movieData.results.map(movie => new Movie(movie));
}

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

module.exports = getMovies;