const express = require('express');
const router = express.Router();
const { seedData } = require('../controllers/seedController');
const { protect } = require('../middleware/auth');

router.post('/', protect, seedData);

module.exports = router;
