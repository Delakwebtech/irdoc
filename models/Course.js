const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const University = require('./University');

const Course = sequelize.define(
  'Course',
  {
    CourseId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CourseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CGPA_Scale: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
    },
    Special: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    InstitutionId: {
      type: DataTypes.INTEGER,
      references: {
        model: University,
        key: 'id',
      },
    },
  },
  {
    timestamps: false,
  }
);

// Association
// University.hasMany(Course, { foreignKey: 'InstitutionId' });
// Course.belongsTo(University, { foreignKey: 'InstitutionId' });

module.exports = Course;
