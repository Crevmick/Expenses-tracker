import express from 'express';
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  exportExpenses, 
} from '../Controllers/ExpensesController.js';
import authenticateUser from '../middleware/authenticateUser.js';

const router = express.Router();

// Route for creating a new expense
router.post('/', authenticateUser, createExpense);

// Route for getting all expenses for the authenticated user
router.get('/', authenticateUser, getExpenses);

// Route for exporting expenses
router.get('/export', authenticateUser, exportExpenses); // New export route

// Route for getting a single expense by ID for the authenticated user
router.get('/:id', authenticateUser, getExpenseById);

// Route for updating an expense by ID for the authenticated user
router.put('/:id', authenticateUser, updateExpense);

// Route for deleting an expense by ID for the authenticated user
router.delete('/:id', authenticateUser, deleteExpense);

export default router;
