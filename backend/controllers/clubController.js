const Club = require('../models/Club');
const Event = require('../models/Event');

// @desc    Get all clubs for college
// @route   GET /api/clubs
// @access  Private
const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ collegeId: req.user.collegeId });
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a club
// @route   POST /api/clubs
// @access  Private
const createClub = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Club name is required' });
    }

    const club = await Club.create({
      name,
      description: description || '',
      collegeId: req.user.collegeId,
      members: [req.user.id]
    });

    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all events for college
// @route   GET /api/clubs/events
// @access  Private
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ collegeId: req.user.collegeId })
      .populate('clubId', 'name')
      .sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Generate random events for testing
// @route   POST /api/clubs/events/random
// @access  Private
const generateRandomEvents = async (req, res) => {
  try {
    // Check if college has any clubs, if not create a dummy one
    let club = await Club.findOne({ collegeId: req.user.collegeId });
    if (!club) {
      club = await Club.create({
        name: 'General Campus Club',
        description: 'Default club for campus events',
        collegeId: req.user.collegeId,
        members: [req.user.id]
      });
    }

    const newEvents = [
      {
        title: 'Tech Symposium 2026',
        description: 'Annual gathering of tech enthusiasts to discuss the future of AI and Web3.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        clubId: club._id,
        collegeId: req.user.collegeId,
        participants: []
      },
      {
        title: 'Hackathon: Code for Good',
        description: 'A 24-hour hackathon focused on building solutions for social impact.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        clubId: club._id,
        collegeId: req.user.collegeId,
        participants: []
      },
      {
        title: 'Career Fair Networking Mixer',
        description: 'Meet alumni and industry professionals in a casual setting.',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        clubId: club._id,
        collegeId: req.user.collegeId,
        participants: []
      }
    ];

    const createdEvents = await Event.insertMany(newEvents);
    res.status(201).json(createdEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Apply to an event
// @route   POST /api/clubs/events/:id/apply
// @access  Private
const applyToEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already a participant
    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already applied to this event' });
    }

    event.participants.push(req.user.id);
    await event.save();

    res.status(200).json({ message: 'Successfully applied to event', event });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  getClubs,
  createClub,
  getEvents,
  generateRandomEvents,
  applyToEvent
};
