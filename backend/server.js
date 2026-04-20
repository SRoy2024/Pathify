const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

const app = express();

app.get("/api/test", (req, res) => {
  res.json({ message: "API working 🚀" });
});

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/collaborations', require('./routes/collaborationRoutes'));
app.use('/api/clubs', require('./routes/clubRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/seed', require('./routes/seedRoutes'));
// Connect to DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
