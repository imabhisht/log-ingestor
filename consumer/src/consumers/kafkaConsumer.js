// src/consumers/kafkaConsumer.js
const { Kafka } = require('kafkajs');
const { saveToElasticsearch } = require('../services/elasticsearchService');

let KAFKA_BROKER_NUMBERS = process.env.KAFKA_BROKER_NUMBERS || "1";
let brokers = [];
let KAFKA_HOSTNAME = process.env.KAFKA_HOSTNAME || "localhost";
for (let i = 0; i < parseInt(KAFKA_BROKER_NUMBERS); i++) {
  if (KAFKA_HOSTNAME != "localhost"){
    brokers.push(`${KAFKA_HOSTNAME}${i+1}:${19092+i}`);
    continue;
  }
  brokers.push(`localhost:${9092+i}`);
}
console.log("Number of brokers: ", KAFKA_BROKER_NUMBERS);
console.log("Brokers: ", brokers);

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
