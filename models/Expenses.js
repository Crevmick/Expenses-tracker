import mongoose from 'mongoose';

const expensesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // Reference to Category model
      required: true,
    },
    date: {
      type: Date,
      default: Date.now, // Automatically set to current date
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Expenses = mongoose.model('Expenses', expensesSchema);

export default Expenses;