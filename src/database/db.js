const { Sequelize } = require('sequelize');

// Create a new instance of Sequelize with MySQL database credentials
const sequelize = new Sequelize('expense_tracker', 'root', 'Ruma@123#', {
  host: 'localhost',
  dialect: 'mysql'
});

// Test the connection to the MySQL database
sequelize.authenticate()
  .then(() => {
    console.log('Connected to the MySQL database');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
