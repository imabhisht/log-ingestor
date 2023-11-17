// src/services/elasticsearchService.js
const { Client } = require('@elastic/elasticsearch');

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL;
const ELASTICSEARCH_INDEX = process.env.ELASTICSEARCH_INDEX;

const client = new Client({ node: ELASTICSEARCH_URL });

client.ping({}, { requestTimeout: 10000 }, (error) => {
  if (error) {
    console.error('Elasticsearch cluster is down!');
  } else {
    console.log('Elasticsearch cluster is ok!');
  }
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
    throw error;
  }
}

module.exports = { saveToElasticsearch };
