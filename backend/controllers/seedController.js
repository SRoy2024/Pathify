const User = require('../models/User');
const College = require('../models/College');
const Club = require('../models/Club');
const Event = require('../models/Event');
const Post = require('../models/Post');
const Collaboration = require('../models/Collaboration');
const bcrypt = require('bcrypt');

// @desc    Seed database with MVP data
// @route   POST /api/seed
// @access  Private
const seedData = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const collegeId = req.user.collegeId;

    // 1. Create a dummy user to act as an author for other content
    let dummyUser = await User.findOne({ email: 'dummy@college.edu' });
    if (!dummyUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      dummyUser = await User.create({
        name: 'Alex Developer',
        email: 'dummy@college.edu',
        password: hashedPassword,
        collegeId: collegeId,
        role: 'student',
        points: 50,
        profile: { branch: 'Computer Science', year: '3rd', skills: ['React', 'Node.js'] }
      });
    }

    // 2. Create a generic club
    let club = await Club.findOne({ name: 'Pathify Tech Innovators' });
    if (!club) {
      club = await Club.create({
        name: 'Pathify Tech Innovators',
        description: 'A club for people who love building cool tech.',
        collegeId: collegeId,
        members: [dummyUser._id, currentUserId] // Add current user immediately
      });
    }

    // 3. Generate Posts
    const postsData = [
      { content: "Just finished building my first React app! The MVP feels so good. #coding", author: dummyUser._id, collegeId },
      { content: "Anyone looking for a study buddy for the upcoming algorithm finals?", author: dummyUser._id, collegeId },
      { content: "Pathify UI is looking sick with these new glassmorphism updates 🔥", author: currentUserId, collegeId }
    ];
    await Post.insertMany(postsData);

    // 4. Generate Events
    const eventsData = [
      {
        title: 'Web3 & AI Workshop',
        description: 'Learn how to integrate LLMs with Smart Contracts. Free pizza provided!',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        clubId: club._id,
        collegeId,
        participants: [dummyUser._id, currentUserId] // Enroll current user
      },
      {
        title: 'Campus Hackathon 2026',
        description: '48 hours to build a product that impacts students. Prizes worth $5000.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
        clubId: club._id,
        collegeId,
        participants: [dummyUser._id] // Current user NOT enrolled yet
      }
    ];
    await Event.insertMany(eventsData);

    // 5. Generate Collaborations
    const collabData = [
      {
        title: 'Building a Campus Ride-sharing App',
        description: 'Need a frontend dev who knows React Native. Backend is already built in Node.js.',
        skillsRequired: ['React Native', 'UI/UX'],
        createdBy: dummyUser._id,
        collegeId,
        applicants: [currentUserId] // Current user applied
      },
      {
        title: 'AI Resume Analyzer',
        description: 'Looking for someone good with Python and NLP to help me build a resume parser.',
        skillsRequired: ['Python', 'NLP', 'FastAPI'],
        createdBy: currentUserId, // Current user created
        collegeId,
        applicants: [dummyUser._id]
      }
    ];
    await Collaboration.insertMany(collabData);

    res.status(200).json({ message: 'MVP Data seeded successfully!' });
  } catch (error) {
    console.error('Seed Error:', error);
    res.status(500).json({ message: 'Server Error during seeding' });
  }
};

module.exports = { seedData };
