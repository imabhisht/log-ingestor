// src/index.js
require('dotenv').config();
const { startKafkaConsumer } = require('./consumers/kafkaConsumer');

(async () => {
  try {
    await startKafkaConsumer();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
