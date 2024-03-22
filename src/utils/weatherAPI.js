const axios = require('axios');

exports.getWeather = async (city, date) => {
  try {
    const response = await axios.get(`https://gg-backend-assignment.azurewebsites.net/api/Weather`, {
      params: {
        code: process.env.AZURE_FUNCTION_KEY_WEATHER,
        city: city,
        date: date,
      },
    });
    return response.data.weather; // Adjust based on actual API response
  } catch (error) {
    console.error(`Error fetching weather for ${city} on ${date}: ${error}`);
    return 'Weather data unavailable';
  }
};

