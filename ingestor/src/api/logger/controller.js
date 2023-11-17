const { producer,kafka } = require("../../init/kafka");

module.exports.log = async (req, res) => {
    try {
        // Accept the message from the request body
        // And send it to the Kafka Topic

        const data = req.body;

        await producer.connect();

        await producer.send({
            topic: process.env.KAFKA_TOPIC,
            messages: [
                { key:"1" ,value: JSON.stringify(data) },
            ],
        });

        await producer.disconnect();

        return res.send('Message sent successfully');


    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}