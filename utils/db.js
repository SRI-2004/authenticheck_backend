const sequelize = require('../config/database');
const Interviewer = require('../models/interviewer');
const Interviewee = require('../models/interviewee');
const Meeting = require('../models/meeting');


sequelize.sync({ alter: true }) // 'force: true' drops the table if it already exists
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error creating database:', err);
  });
