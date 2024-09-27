const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Interviewee = sequelize.define('Interviewee', {
  interviewee_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_no: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_photo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  face_id: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  voice_id: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  is_interviewee: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: true,
  },
});

module.exports = Interviewee;
