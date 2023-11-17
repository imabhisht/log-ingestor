// src/consumers/kafkaConsumer.js
const { Kafka } = require('kafkajs');
const { saveToElasticsearch } = require('../services/elasticsearchService');

let KAFKA_BROKER_NUMBERS = process.env.KAFKA_BROKER_NUMBERS || "1";
let brokers = [];
for (let i = 0; i < parseInt(KAFKA_BROKER_NUMBERS); i++) {
    brokers.push(`localhost:909${i+2}`);
}
console.log("Number of brokers: ", KAFKA_BROKER_NUMBERS);

const kafka = new Kafka({
  clientId: 'Producer_1',
  brokers: brokers,
});
const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID });

async function startKafkaConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const obj = JSON.parse(message.value.toString());
        console.log(obj);
        await saveToElasticsearch(obj);
      } catch (error) {
        console.error('Error parsing or saving to Elasticsearch:', error);
      }
    },
  });
}

module.exports = { startKafkaConsumer };
