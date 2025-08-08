  const express = require('express');
  const cors = require('cors');
  const dotenv = require('dotenv');
  const mongoose = require('mongoose');

  // Load environment variables before anything else
  dotenv.config({ path: './environment.env' });

  const app = express();

  // CORS middleware - sirf apne frontend domain ko allow karein
  const allowedOrigins = [
  'https://crit-tyzt.vercel.app', // production
  'https://crit-5iau.vercel.app', // preview builds if you test from these
  'http://localhost:3000' // local dev
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // MongoDB connection
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crit_forms', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

  // Import routes
  const contactRoutes = require('./routes/contact');
  const ctaRoutes = require('./routes/cta');
  const careerRoutes = require('./routes/career');
  const opportunityRoutes = require('./routes/opportunity');
  const reviewRoutes = require('./routes/review');

  // Routes
  app.use('/api/contact', contactRoutes);
  app.use('/api/cta', ctaRoutes);
  app.use('/api/career', careerRoutes);
  app.use('/api/opportunity', opportunityRoutes);
  app.use('/api/review', reviewRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'CRIT Backend API is running' });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
