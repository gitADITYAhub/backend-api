// eventsController.js

const Event = require('../models/eventModel');
const { getWeather } = require('../utils/weatherAPI');
const { getDistance } = require('../utils/distanceAPI');
const moment = require('moment');
exports.findEvents = async (req, res) => {
    const { latitude, longitude, date, page } = req.query; // Extract page parameter
  
    try {
      // Calculate date range
      const startDate = moment(date).startOf('day');
      const endDate = moment(date).add(14, 'days').endOf('day');
  
      // Query events in the next 14 days
      const events = await Event.find({
        date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
      });
  
      // Enrich events with weather and distance
      const enrichedEvents = await Promise.all(events.map(async (event) => {
        try {
          const weather = await getWeather(event.cityName, event.date);
          const distance = await getDistance(latitude, longitude, event.latitude, event.longitude);
          return {
            ...event.toObject(),
            weather,
            distance: `${distance} km`,
          };
        } catch (error) {
          console.error(`Error enriching event: ${error}`);
          // Return event without weather and distance if there's an error
          return event.toObject();
        }
      }));
  
      // Sort by date
      const sortedEvents = enrichedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  
      // Calculate pagination parameters
      const pageSize = 10;
      const totalPages = Math.ceil(sortedEvents.length / pageSize);
      const currentPage = parseInt(page) || 1; // Parse page parameter or default to 1
  
      // Calculate start and end index for current page
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
  
      // Get events for the current page
      const paginatedEvents = sortedEvents.slice(startIndex, endIndex);
  
      // Return paginated results
      res.json({
        events: paginatedEvents,
        page: currentPage,
        pageSize: pageSize,
        totalEvents: sortedEvents.length,
        totalPages: totalPages,
      });
    } catch (error) {
      console.error(`findEvents error: ${error}`);
      res.status(500).send('Error fetching events');
    }
  };