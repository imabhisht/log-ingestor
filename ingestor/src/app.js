require('dotenv').config()
const express = require('express');
const app = express();
const port = 3000;

// Use bodyParser middleware to parse JSON
app.use(express.json());

app.get('/', (req, res) => {
  return res.send('Ingestor Service is up and running!!');
});

app.use('/health_check', require('./api/health_check/routes'));
app.use('/logger', require('./api/logger/routes'));

// app.get('/get-topic', async(req, res) => {
//   try {
//     const topics = await admin.listTopics();
//     return res.send(topics);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: error.message });
//   }
// });

// app.get('/test', async(req, res) => {
//   try {
//     const producer = kafka.producer()

//     // Connect to the producer
//     await producer.connect()

//     // Send an event to the demoTopic topic
//     await producer.send({
//       topic: 'test-topic',
//       messages: [
//         { value: 'Hello micro-services world!' },
//       ],
//     });

//     // Disconnect the producer once we're done
//     await producer.disconnect();
//     return res.send('Test Reponse');
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: error.message });
//   }
  
// });



module.exports = app;