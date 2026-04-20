const express = require('express');
const router = express.Router();
const { getCollaborations, createCollaboration, applyToCollaboration } = require('../controllers/collaborationController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getCollaborations)
  .post(protect, createCollaboration);

router.route('/:id/apply')
  .post(protect, applyToCollaboration);

module.exports = router;
