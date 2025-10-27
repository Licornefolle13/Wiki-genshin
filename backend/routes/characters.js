const express = require('express');
const router = express.Router();
const characters = require('../controllers/charactersController');

router.get('/', characters.list);

module.exports = router;
