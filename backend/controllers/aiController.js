const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing in environment variables');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        response_mime_type: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch from Gemini API');
  }

  const data = await response.json();
  const rawText = data.candidates[0].content.parts[0].text;
  return JSON.parse(rawText);
};

// @desc    Generate AI Roadmap
// @route   POST /api/ai/roadmap
// @access  Private
const generateRoadmap = async (req, res) => {
  try {
    const { goal, skills, experienceLevel } = req.body;

    const prompt = `
      You are an expert career counselor. Generate a learning roadmap.
      User Goal: ${goal || 'Not specified'}
      User Skills: ${skills && Array.isArray(skills) ? skills.join(', ') : 'None'}
      Experience Level: ${experienceLevel || 'Beginner'}
      
      Return a structured JSON array of objects. Each object must have a "month" (string) and "task" (string). 
      Limit to 6 steps. 
      JSON schema example: [ { "month": "Month 1", "task": "Learn X" } ]
    `;

    const roadmapData = await callGemini(prompt);
    
    // Ensure roadmap is returned as `{ roadmap: [...] }`
    res.status(200).json({ roadmap: Array.isArray(roadmapData) ? roadmapData : roadmapData.roadmap || [] });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Generate AI Weekly Plan
// @route   POST /api/ai/weekly
// @access  Private
const generateWeekly = async (req, res) => {
  try {
    const { goal, skills, experienceLevel } = req.body;

    const prompt = `
      You are an expert career counselor. Generate a weekly task list based on the user's career goal.
      User Goal: ${goal || 'Not specified'}
      User Skills: ${skills && Array.isArray(skills) ? skills.join(', ') : 'None'}
      Experience Level: ${experienceLevel || 'Beginner'}
      
      Return a structured JSON array of objects. Each object must have a "day" (string, e.g., "Monday") and "tasks" (array of strings).
      JSON schema example: [ { "day": "Monday", "tasks": ["Task 1", "Task 2"] } ]
    `;

    const weeklyData = await callGemini(prompt);
    res.status(200).json({ weekly: Array.isArray(weeklyData) ? weeklyData : weeklyData.weekly || [] });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Generate AI Resume Points
// @route   POST /api/ai/resume
// @access  Private
const generateResume = async (req, res) => {
  try {
    const { goal, skills, experienceLevel } = req.body;

    const prompt = `
      You are an expert resume writer. Generate resume bullet points and a professional summary.
      User Goal: ${goal || 'Not specified'}
      User Skills: ${skills && Array.isArray(skills) ? skills.join(', ') : 'None'}
      Experience Level: ${experienceLevel || 'Beginner'}
      
      Return a structured JSON object. It must have a "summary" (string) and "bulletPoints" (array of strings).
      JSON schema example: { "summary": "Experienced professional...", "bulletPoints": ["Led a team...", "Developed X..."] }
    `;

    const resumeData = await callGemini(prompt);
    res.status(200).json({ resume: resumeData });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  generateRoadmap,
  generateWeekly,
  generateResume
};
