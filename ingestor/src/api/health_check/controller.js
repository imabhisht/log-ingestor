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
        console.log(process.env.KAFKA_TOPIC);
        const list_topics = await admin.listTopics();
        console.log(list_topics);
        if(list_topics.includes(process.env.KAFKA_TOPIC))
            return res.send("OK");
        else
            throw new Error("Kafka Topic not found");
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};