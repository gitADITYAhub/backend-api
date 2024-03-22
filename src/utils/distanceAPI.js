
const axios = require('axios');

exports.getDistance = async (latitude1, longitude1, latitude2, longitude2) => {
  try {
    const response = await axios.get('https://gg-backend-assignment.azurewebsites.net/api/Distance', {
      params: {
        code: process.env.AZURE_FUNCTION_KEY_DIST,
        latitude1,
        longitude1,
        latitude2,
        longitude2,
      },
    });

    return response.data.distance; // Adjust based on actual API response
  } catch (error) {
    console.error(`Error fetching distance: ${error.message}`);
    // Throw the error to be handled by the caller
    throw new Error('Error fetching distance');
  }
};
