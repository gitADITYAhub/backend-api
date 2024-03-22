const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: String,
  cityName: String,
  date: Date,
  time: String,
  latitude: Number,
  longitude: Number,
});

module.exports = mongoose.model('Event', eventSchema);
