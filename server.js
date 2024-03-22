const app = require('./src/app');
const port = process.env.PORT || 3000;
const fs = require('fs');
const csvParser = require('csv-parser');
const mongoose = require('mongoose');
const Event = require('./src/models/eventModel'); // Update the path based on your structure
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

  fs.createReadStream('./data.csv')
  .pipe(csvParser())
  .on('data', (row) => {
    const dateString = row['date'].trim();
    const date = new Date(dateString);
    const latitude = parseFloat(row['latitude'].trim());
    const longitude = parseFloat(row['longitude'].trim());

    // Basic error checking
    if (isNaN(date.getTime())) {
      console.error(`Invalid date for event: ${row['event_name']}`);
      return; // Skip this row
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      console.error(`Invalid latitude or longitude for event: ${row['event_name']}`);
      return; // Skip this row
    }

    const event = new Event({
      eventName: row['event_name'],
      cityName: row['city_name'],
      date: date,
      time: row['time'].trim(),
      latitude: latitude,
      longitude: longitude,
    });

    event.save().catch(err => console.error(err));
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
