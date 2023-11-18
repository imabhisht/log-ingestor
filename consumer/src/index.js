// src/index.js
require('dotenv').config();
const express = require('express');
const { startKafkaConsumer } = require('./consumers/kafkaConsumer');

const app = express();
const port = process.env.API_PORT || 3001;

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Kafka Consumer
(async () => {
  try {
    await startKafkaConsumer();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();

// Start Express Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
