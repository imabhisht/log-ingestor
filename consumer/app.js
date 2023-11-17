const { Kafka } = require('kafkajs');
const { Client } = require('@elastic/elasticsearch');

const ELASTICSEARCH_URL = 'http://localhost:9200';
const ELASTICSEARCH_INDEX = 'your_index_name';


const client = new Client({ node: ELASTICSEARCH_URL });

const kafka = new Kafka({
  clientId: 'Producer_1',
  brokers: ['localhost:9092', 'localhost:9093'],
});


async function saveToElasticsearch(obj) {
  try {
    await client.index({
      index: ELASTICSEARCH_INDEX,
      body: obj,
    });
    console.log('Document indexed in Elasticsearch:', obj);
  } catch (error) {
    console.error('Error indexing document in Elasticsearch:', error);
  }
}



(async () => {
  try {
    const consumer = kafka.consumer({ groupId: 'test-group' })

    await consumer.connect()
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

    await client.indices.create({
      index: ELASTICSEARCH_INDEX,
      body: {
        mappings: {
          "properties": {
            "level": {
              "type": "keyword"
            },
            "message": {
              "type": "text"
            },
            "resourceId": {
              "type": "keyword"
            },
            "timestamp": {
              "type": "date",
              "format": "strict_date_optional_time||epoch_millis"
            },
            "traceId": {
              "type": "keyword"
            },
            "spanId": {
              "type": "keyword"
            },
            "commit": {
              "type": "keyword"
            },
            "metadata": {
              "properties": {
                "parentResourceId": {
                  "type": "keyword"
                }
              }
            }
          }
        }
      },
    }, { ignore: [400] })

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const obj = JSON.parse(message.value.toString());
        console.log(obj)
        saveToElasticsearch(obj);
      },
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
  
  

})();