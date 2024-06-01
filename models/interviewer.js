const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Interviewer = sequelize.define('Interviewer', {
  interviewer_id: {
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
  organisation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_photo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: true,
  },
});

module.exports = Interviewer;
