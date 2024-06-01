const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Interviewer = require('./interviewer');
const Interviewee = require('./interviewee');

const Meeting = sequelize.define('Meeting', {
  meeting_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  interviewer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Interviewer,
      key: 'interviewer_id'
    }
  },
  interviewee_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Interviewee,
      key: 'interviewee_id'
    }
  }
});

// Define associations
Interviewer.hasMany(Meeting, { foreignKey: 'interviewer_id' });
Interviewee.hasMany(Meeting, { foreignKey: 'interviewee_id' });
Meeting.belongsTo(Interviewer, { foreignKey: 'interviewer_id' });
Meeting.belongsTo(Interviewee, { foreignKey: 'interviewee_id' });

module.exports = Meeting;
