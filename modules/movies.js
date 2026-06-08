'use strict';
// impot the axios library to make API requests
const axios = require('axios');

// Lab 8: Create a function to get movies from the API
async function getMovies(searchQuery) {
  const url = `https://api.themoviedb.org/3/search/movie`;

  // Lab 8: ADD Axios to make the API request with query parameters
  const response = await axios.get(url, {
    params: {
      api_key: process.env.MOVIE_API_KEY,
      query: searchQuery
    }
  });

  return parseMovies(response.data);
}

function parseMovies(movieData) {
  return movieData.results.map(movie => new Movie(movie)); // "movie" represents ONE movie at a time, and we return a cleaned-up movie object

}
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

module.exports = getMovies;