import Expenses from '../models/Expenses.js';
import Category from '../models/Category.js'; // Needed to check if category exists

// Create a new expense
export const createExpense = async (req, res) => {
  const { title, amount, categoryId, date, note } = req.body;
  const userId = req.user.id; // Assuming authenticateUser middleware adds user to req

  try {
    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).send('Category not found');
    }

    const expense = new Expenses({
      user: userId,
      title,
      amount,
      category: categoryId,
      date,
      note,
    });

    await expense.save();
    return res.status(201).json({
      message: 'Expense created successfully',
      expense,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong while creating the expense',
      error: err.message,
    });
  }
};

// Get all expenses for the authenticated user
export const getExpenses = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expenses.find({ user: userId }).populate('category', 'name description');
    return res.status(200).json({ expenses });
  } catch (err) {
    return res.status(500).json({
      message: 'Error fetching expenses',
      error: err.message,
    });
  }
};

// Get an expense by ID for the authenticated user
export const getExpenseById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const expense = await Expenses.findOne({ _id: id, user: userId }).populate('category', 'name description');
    if (!expense) {
      return res.status(404).send('Expense not found or access denied');
    }
    return res.status(200).json({ expense });
  } catch (err) {
    return res.status(500).json({
      message: 'Error fetching expense by ID',
      error: err.message,
    });
  }
};

// Update an existing expense for the authenticated user
export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, amount, categoryId, date, note } = req.body;

  try {
    const expense = await Expenses.findOne({ _id: id, user: userId });
    if (!expense) {
      return res.status(404).send('Expense not found or access denied');
    }

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).send('Category not found');
      }
      expense.category = categoryId;
    }

    expense.title = title || expense.title;
    expense.amount = amount || expense.amount;
    expense.date = date || expense.date;
    expense.note = note || expense.note;

    await expense.save();
    return res.status(200).json({
      message: 'Expense updated successfully',
      expense,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Error updating expense',
      error: err.message,
    });
  }
};

// Delete an expense for the authenticated user
export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const expense = await Expenses.findOne({ _id: id, user: userId });
    if (!expense) {
      return res.status(404).send('Expense not found or access denied');
    }

    await Expenses.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    return res.status(500).json({
      message: 'Error deleting expense',
      error: err.message,
    });
  }
};
