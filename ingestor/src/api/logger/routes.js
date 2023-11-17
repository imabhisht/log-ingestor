// Routes for the logger module

const express = require('express');
const router = express.Router();
const loggerController = require('./controller');

router.post('/', loggerController.log);

module.exports = router;
