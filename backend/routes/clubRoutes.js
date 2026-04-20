const express = require('express');
const router = express.Router();
const { getClubs, createClub, getEvents, generateRandomEvents, applyToEvent } = require('../controllers/clubController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getClubs)
  .post(protect, createClub);

router.route('/events')
  .get(protect, getEvents);

router.route('/events/random')
  .post(protect, generateRandomEvents);

router.route('/events/:id/apply')
  .post(protect, applyToEvent);

module.exports = router;
