const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const State = sequelize.define('State', {
  stateId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  stateName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, 
{
  timestamps: false, 
});

module.exports = State;