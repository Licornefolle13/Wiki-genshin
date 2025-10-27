const express = require('express');
const router = express.Router();

router.use('/weapons', require('./weapons'));
router.use('/characters', require('./characters'));
router.use('/artifacts', require('./artifacts'));
router.use('/map_markers', require('./map_markers'));

module.exports = router;
