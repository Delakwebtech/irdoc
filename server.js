const dotenv = require('dotenv');

// Load env vars
const path = require('path');
dotenv.config({ path: './config/config.env' });

const express = require('express');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');

// connect to database
const connectDB = require('./config/db');
connectDB();


// Route files
const state = require('./routes/states');
const university = require('./routes/universities');
const course = require('./routes/courses');

const app = express();

// Body Perser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/undergraduate', state, university, course);
// app.use('/universities', university);
// app.use('/courses', course);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // close server and exit process
  server.close(() => process.exit(1));
});
