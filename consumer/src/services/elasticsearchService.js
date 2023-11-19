// src/services/elasticsearchService.js
const { Client } = require('@elastic/elasticsearch');

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL;
const ELASTICSEARCH_INDEX = process.env.ELASTICSEARCH_INDEX;

const client = new Client({ node: ELASTICSEARCH_URL });

// Function to check if the index exists
async function indexExists(index) {
  const { body } = await client.indices.exists({ index });
  return body;
}

// Function to create the index with mapping
async function createIndexWithMapping(index) {
  try {
    await client.indices.create({
      index,
      body: {
        mappings: {
          properties: {
            level: { type: 'keyword' },
            message: { type: 'text' },
            resourceId: { type: 'keyword' },
            timestamp: { type: 'date' },
            traceId: { type: 'keyword' },
            spanId: { type: 'keyword' },
            commit: { type: 'keyword' },
            metadata: {
              properties: {
                parentResourceId: { type: 'keyword' },
              },
            },
          },
        },
      },
    });
    console.log(`Index '${index}' created with mapping.`);
  } catch (error) {
    console.error(`Error creating index '${index}' with mapping:`, error);
    throw error;
  }
}

// Ping Elasticsearch to check cluster status
client.ping({}, { requestTimeout: 10000 }, (error) => {
  if (error) {
    console.error('Elasticsearch cluster is down!');
  } else {
    console.log('Elasticsearch cluster is ok!');

    // Check if the index exists, and create it with mapping if not
    indexExists(ELASTICSEARCH_INDEX).then((exists) => {
      if (!exists) {
        createIndexWithMapping(ELASTICSEARCH_INDEX);
      }
    });
  }
});

// Function to save data to Elasticsearch
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
