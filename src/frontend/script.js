document.addEventListener('DOMContentLoaded', () => {
    const expensesTable = document.querySelector('#expensesTable tbody');
    const expenseForm = document.getElementById('expenseForm');
    const submitButton = document.getElementById('submitButton');
    let isEditing = false;  // Flag to check if we're editing an existing expense
    let editingExpenseId = null;  // Store the ID of the expense being edited

    // Function to fetch all expenses and display in the table
    const fetchExpenses = async () => {
        try {
            const response = await fetch('http://localhost:4400/expenses');
            const data = await response.json();
            renderExpensesTable(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    // Render the fetched expenses data into the table
    const renderExpensesTable = (data) => {
        expensesTable.innerHTML = '';  // Clear table before inserting new data

        data.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.id}</td>
                <td>${expense.amount}</td>
                <td>${expense.description}</td>
                <td>${expense.category}</td>
                <td class = "buttons">
                    <button class="editBtn" data-id="${expense.id}">Edit</button>
                    <button class="deleteBtn" data-id="${expense.id}">Delete</button>
                </td>
            `;
            expensesTable.appendChild(row);
        });

        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.editBtn').forEach(button => {
            button.addEventListener('click', handleEditExpense);
        });
        document.querySelectorAll('.deleteBtn').forEach(button => {
            button.addEventListener('click', handleDeleteExpense);
        });
    };

    // Function to handle form submission (both add and update)
    expenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;

        if (isEditing) {
            // Update existing expense
            try {
                const response = await fetch(`http://localhost:4400/expenses/${editingExpenseId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount, description, category }),
                });
                const result = await response.json();
                alert(result.message);
                fetchExpenses();  // Refresh the table after updating
            } catch (error) {
                console.error('Error updating expense:', error);
            }
        } else {
            // Add a new expense
            try {
                const response = await fetch('http://localhost:4400/expenses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount, description, category }),
                });
                const result = await response.json();
                alert(result.message);
                fetchExpenses();  // Refresh the table after adding
            } catch (error) {
                console.error('Error adding expense:', error);
            }
        }

        // Reset the form and state
        resetForm();
    });

    // Function to handle editing an expense
    const handleEditExpense = (e) => {
        const id = e.target.dataset.id;

        // Fetch the specific expense data and populate the form for editing
        fetch(`http://localhost:4400/expenses/${id}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('amount').value = data.amount;
                document.getElementById('description').value = data.description;
                document.getElementById('category').value = data.category;
                editingExpenseId = data.id;
                isEditing = true;
                submitButton.textContent = 'Update Expense';  // Change button text
            })
            .catch(error => console.error('Error fetching expense data for editing:', error));
    };

    // Function to handle deleting an expense
    const handleDeleteExpense = (e) => {
        const id = e.target.dataset.id;

        if (confirm('Are you sure you want to delete this expense?')) {
            fetch(`http://localhost:4400/expenses/${id}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(result => {
                    alert(result.message);
                    fetchExpenses();  // Refresh the table after deleting
                })
                .catch(error => console.error('Error deleting expense:', error));
        }
    };

    // Function to reset the form and state after adding/editing
    const resetForm = () => {
        document.getElementById('expenseId').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('description').value = '';
        document.getElementById('category').value = '';
        isEditing = false;
        editingExpenseId = null;
        submitButton.textContent = 'Add Expense';  // Reset button text
    };

    // Initial fetch of expenses when page loads
    fetchExpenses();
});
