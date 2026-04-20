const Collaboration = require('../models/Collaboration');

// @desc    Get all collaborations for college
// @route   GET /api/collaborations
// @access  Private
const getCollaborations = async (req, res) => {
  try {
    const collabs = await Collaboration.find({ collegeId: req.user.collegeId })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(collabs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a collaboration
// @route   POST /api/collaborations
// @access  Private
const createCollaboration = async (req, res) => {
  try {
    const { title, description, skillsRequired } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const collab = await Collaboration.create({
      title,
      description,
      skillsRequired: skillsRequired || [],
      createdBy: req.user.id,
      collegeId: req.user.collegeId,
      applicants: []
    });

    req.user.points += 10;
    await req.user.save();

    res.status(201).json(collab);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Apply to a collaboration
// @route   POST /api/collaborations/:id/apply
// @access  Private
const applyToCollaboration = async (req, res) => {
  try {
    const collab = await Collaboration.findById(req.params.id);
    if (!collab) {
      return res.status(404).json({ message: 'Collaboration not found' });
    }

    if (collab.createdBy.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot apply to your own collaboration request' });
    }

    if (collab.applicants.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already applied to this collaboration' });
    }

    collab.applicants.push(req.user.id);
    await collab.save();

    res.status(200).json({ message: 'Successfully applied', collab });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getCollaborations,
  createCollaboration,
  applyToCollaboration
};
