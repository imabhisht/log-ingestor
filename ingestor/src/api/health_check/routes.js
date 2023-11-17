// Routes for the logger module

const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/topics', controller.list_topics);

router.get('/', controller.health_check);

router.post('/create-topic', controller.create_topic);  
module.exports = router;
