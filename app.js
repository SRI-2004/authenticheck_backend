const express = require('express');
const bodyParser = require('body-parser');
const db = require('./utils/db'); // Import the db.js file

// Create Express app
const app = express();


const authRouter = require('./routes/auth');
const interviewerRouter = require('./routes/interviewer');
const intervieweeRouter = require('./routes/interviewee');

// Create Express app
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/interviewer', interviewerRouter);
app.use('/interviewee', intervieweeRouter);
require('dotenv').config();

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
