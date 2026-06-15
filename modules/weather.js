'use strict';

const axios = require('axios');
let cache = require('./cache.js');
// let cache = {}; // 👉 This removes dependency risk entirely.

async function getWeather(latitude, longitude) {
  try {
    const key = 'weather-' + latitude + longitude;

    // const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${latitude}&lon=${longitude}&days=5`;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;   
    // This is a fix for API rejection due to missing or invalid API key. 

    // CACHE HIT --> Is this searched term already in cache
    if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
      console.log('Cache hit'); // Found!
      return cache[key].data; // When/if found, return found data
    }

    console.log('Cache miss'); // NOT found

    // Since it was not found, the requests runs
    const response = await axios.get(url);
    const parsed = parseWeather(response.data);

    cache[key] = {
      timestamp: Date.now(),
      data: parsed
    };
    
    console.log(parsed);
    return parsed;
    
  } catch (error) {
    console.error('WEATHER API ERROR:', error.response?.data || error.message);
    throw error;
  }
}

function parseWeather(data) {
  return data.daily.time.map((date, index) => {
    const weatherCode = data.daily.weathercode[index];

    return {
      day: date,
      description: getWeatherDescription(weatherCode),
      icon: weatherCode,
      maxTemp: data.daily.temperature_2m_max[index],
      minTemp: data.daily.temperature_2m_min[index]
    };
  });
}

//Fix for the weather code description, since the API returns a numeric code instead of a text description. This function maps the numeric code to a human-readable description based on the Open-Meteo documentation.
function getWeatherDescription(code) {
  const codes = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Fog',
    61: 'Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    71: 'Snow',
    80: 'Rain Showers'
  };

  return codes[code] || 'Unknown';
}


module.exports = getWeather;