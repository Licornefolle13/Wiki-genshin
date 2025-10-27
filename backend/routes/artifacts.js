const express = require('express');
const router = express.Router();
const artifacts = require('../controllers/artifactsController');

router.get('/', artifacts.list);

module.exports = router;
