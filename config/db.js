const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    dialectOptions: {
      // ssl: {
      //   rejectUnauthorized: false,
      // },
    },
  }
);

module.exports = sequelize;
