const { producer,kafka,admin } = require("../../init/kafka");

module.exports.create_topic = async (req, res) => {
    try {
        // Accept the message from the request body
        // And send it to the Kafka Topic
        const create_topic = await admin.createTopics({
            topics: [{
                topic: process.env.KAFKA_TOPIC,
                numPartitions: 1,
                replicationFactor: 1
            }],
            waitForLeaders: true,
        });

        return res.send(create_topic);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports.list_topics = async (req, res) => {
    try {
        // Accept the message from the request body
        // And send it to the Kafka Topic
        const list_topics = await admin.listTopics();

        return res.send(list_topics);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports.health_check = async (req, res) => {
    try {
        await admin.connect();
        const metadata = await admin.describeCluster();
        console.log('Connected to Kafka cluster:', metadata);
        return res.send({ message: 'Connected to Kafka cluster', metadata });

      } catch (error) {
        console.error('Error connecting to Kafka:', error.message);
        return res.status(500).send({ error: error.message });
      }
};