import express from 'express';
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from '../Controllers/ExpensesController.js';
import authenticateUser from '../middleware/authenticateUser.js';

const router = express.Router();

// Route for creating a new expense
router.post('/expense', authenticateUser, createExpense);

// Route for getting all expenses for the authenticated user
router.get('/expenses', authenticateUser, getExpenses);

// Route for getting a single expense by ID for the authenticated user
router.get('/expenses/:id', authenticateUser, getExpenseById);

// Route for updating an expense by ID for the authenticated user
router.put('/expenses/:id', authenticateUser, updateExpense);

// Route for deleting an expense by ID for the authenticated user
router.delete('/expenses/:id', authenticateUser, deleteExpense);

export default router;
