const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const councilRoutes = require('./routes/councils');
const teamRoutes = require('./routes/teams');
const galleryRoutes = require('./routes/gallery');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB Connection to Atlas
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// MongoDB connection through mongo shell (commented out, for future use)
// mongoose.connect(MONGODB_URI)
//   .then(() => console.log('MongoDB connected successfully via Shell'))
//   .catch(err => {
//     console.error('MongoDB shell connection error:', err);
//     process.exit(1); // Exit process with failure
//   });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/councils', councilRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/gallery', galleryRoutes);

// Basic route for API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const path = require('path');

// Serve static files from the dist directory (Vite output)
app.use(express.static(path.join(__dirname, '../dist')));

// For any route not handled by API, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

module.exports = app;
