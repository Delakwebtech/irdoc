const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const State = require('./State');

const University = sequelize.define(
  'University',
  {
    InstitutionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    InstitutionName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stateId: {
      type: DataTypes.INTEGER,
      references: {
        model: State,
        key: 'stateId',
      },
    },
  },
  {
    timestamps: false, 
  }
);

// Association
// State.hasMany(University, { foreignKey: 'stateId' });
// University.belongsTo(State, { foreignKey: 'stateId' });

module.exports = University;
