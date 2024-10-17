const express = require('express');
const router = express.Router();
const ExpensesData = require('../models/expensesModel');  // Import the ExpensesData model

// Route to get all tableData
router.get('/', async (req, res) => {
  try {
    const data = await ExpensesData.findAll();  // Use Sequelize to fetch all data
    res.json(data);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).send('Error retrieving data from the database');
  }
});

// Route to insert a new product
router.post('/', async (req, res) => {
  const {amount, description, category} = req.body;
  
  try {
    const newData = await ExpensesData.create({amount, description, category});  // Use Sequelize to create a new data
    res.json({ message: 'ExpensesData added successfully', product: newData });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error inserting data into the database');
  }
});
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const data = await ExpensesData.findByPk(id);  // Find the record by primary key (customer_id)

    if (!data) {
      return res.status(404).send('ExpensesData not found');
    }

    res.json(data);  // Return the found record as JSON
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error retrieving data from the database');
  }
});
// Route to update an existing product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {amount, description, category} = req.body;

  try {
    const data = await ExpensesData.findByPk(id);  // Find data by its primary key (ID)

    if (!data) {
      return res.status(404).send('ExpensesData not found');
    }

    // Update the data's details
    data.amount = amount;
    data.description = description;
    data.category = category;
    await data.save();  // Save the updated data

    res.json({ message: 'ExpensesData updated successfully', data });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).send('Error updating data in the database');
  }
});
// Route to delete an existing expense by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const data = await ExpensesData.findByPk(id);  // Find the record by its primary key (ID)
      
      if (!data) {
        return res.status(404).send('Expense not found');
      }
  
      await data.destroy();  // Delete the found record
      res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).send('Error deleting data from the database');
    }
  });
  
module.exports = router;
