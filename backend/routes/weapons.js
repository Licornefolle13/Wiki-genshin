const express = require('express');
const router = express.Router();
const weapons = require('../controllers/weaponsController');

router.get('/', weapons.list);

module.exports = router;
