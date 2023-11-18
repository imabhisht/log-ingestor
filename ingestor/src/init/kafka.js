const { Kafka } = require('kafkajs');

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


let adminKafka = kafka.admin();
const createTopic = async () => {
  try {
    const create_topic = await adminKafka.createTopics({
      topics: [
        {
          topic: process.env.KAFKA_TOPIC,
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
      waitForLeaders: true,
    });

    console.log('Kafka Topic is Created:', create_topic);
  } catch (error) {
    console.error('Error creating Kafka topic:', error.message);
    throw error; // Re-throw the error to trigger a retry
  }
};

const retry = async (operation, maxRetries, delay) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      await operation();
      return; // Success, exit the loop
    } catch (error) {
      retries++;
      console.log(`Retry ${retries} of ${maxRetries}. Waiting for ${delay / 1000} seconds before retrying...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Operation failed after ${maxRetries} retries.`);
};

(async () => {
  try {
    await adminKafka.connect(); // Connect to Kafka before creating topics
    await retry(createTopic, 5, 5000); // Retry createTopic up to 5 times with a delay of 5 seconds
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
module.exports.admin = adminKafka;
module.exports.producer = kafka.producer();
module.exports.kafka = kafka;
