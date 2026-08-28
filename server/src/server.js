const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Enable CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Root Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    institution: 'Karadibayu Primary School (ካራዲባዩ አንደኛ ደረጃ ትምህርት ቤት)',
    system: 'School Information & Student Grade Portal System',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/marks', require('./routes/markRoutes'));
app.use('/api/reports', require('./routes/reportCardRoutes'));
app.use('/api/academic', require('./routes/academicRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found on this server.`,
  });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Karadibayu Primary School API running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`[Unhandled Rejection Error]: ${err.message}`);
  // server.close(() => process.exit(1));
});
