const express = require('express');
const router = express.Router();
const { generateRoadmap, generateWeekly, generateResume } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/roadmap', protect, generateRoadmap);
router.post('/weekly', protect, generateWeekly);
router.post('/resume', protect, generateResume);

module.exports = router;
