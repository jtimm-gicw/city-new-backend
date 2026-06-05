'use strict';

const axios = require('axios');
let cache = require('./cache.js');

async function getWeather(latitude, longitude) {
  const key = 'weather-' + latitude + longitude;

  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${latitude}&lon=${longitude}&days=5`;

  // CACHE HIT
  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
    return cache[key].data;
  }

  // CACHE MISS
  console.log('Cache miss');

  const response = await axios.get(url);
  const parsed = parseWeather(response.data);

  cache[key] = {
    timestamp: Date.now(),
    data: parsed
  };

  return parsed;
}

function parseWeather(weatherData) {
  return weatherData.data.map(day => new Weather(day));
}

class Weather {
  constructor(day) {
    this.date = day.datetime;
    this.description = day.weather.description;
    this.icon = day.weather.icon;
  }
}

module.exports = getWeather;