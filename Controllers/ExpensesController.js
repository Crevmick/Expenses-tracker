import Expenses from '../models/Expenses.js';
import Category from '../models/Category.js'; 

// Create a new expense
export const createExpense = async (req, res) => {
  const { title, amount, categoryId, date, note } = req.body;
  const userId = req.user.id; 

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

// Get all expenses 
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

// Export expenses
export const exportExpenses = async (req, res) => {
  const userId = req.user.id;
  const { format } = req.query; // e.g., 'csv', 'xlsx', 'pdf'

  try {
    const expenses = await Expenses.find({ user: userId })
      .populate('category', 'name')
      .lean(); // Use .lean() for plain JS objects, easier for manipulation

    if (!expenses || expenses.length === 0) {
      return res.status(404).send('No expenses found to export.');
    }

    // Prepare data for export (especially for CSV and Excel)
    const dataToExport = expenses.map(exp => ({
      Title: exp.title,
      Amount: exp.amount,
      Category: exp.category ? exp.category.name : 'N/A', // Handle if category is not populated or missing
      Date: exp.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      Note: exp.note || '',
    }));

    if (format === 'csv') {
      // CSV Export
      const { Parser } = await import('json2csv');
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(dataToExport);

      res.header('Content-Type', 'text/csv');
      res.attachment('expenses.csv');
      return res.send(csv);

    } else if (format === 'xlsx') {
      // XLSX Export
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Expenses');

      // Define columns based on dataToExport keys
      worksheet.columns = Object.keys(dataToExport[0]).map(key => ({
        header: key,
        key: key,
        width: key === 'Note' ? 30 : (key === 'Title' ? 25 : 15) // Adjust column widths
      }));

      // Add rows
      worksheet.addRows(dataToExport);

      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'FFE0E0E0'} // Light grey background
      };

      res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.attachment('expenses.xlsx');
      await workbook.xlsx.write(res);
      return res.end();

    } else if (format === 'pdf') {
      // PDF Export
      const PDFDocument = (await import('pdfkit')).default;
      const doc = new PDFDocument({ margin: 30, size: 'A4' });

      res.header('Content-Type', 'application/pdf');
      res.attachment('expenses.pdf');
      doc.pipe(res);

      // Document Title
      doc.fontSize(18).font('Helvetica-Bold').text('Expenses Report', { align: 'center' });
      doc.moveDown(1);

      // Table Headers
      const tableTop = doc.y;
      const itemX = 30;
      const amountX = 150;
      const categoryX = 250;
      const dateX = 350;
      const noteX = 450;
      const rowHeight = 25;

      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Title', itemX, tableTop, { width: amountX - itemX, continued: false });
      doc.text('Amount', amountX, tableTop, { width: categoryX - amountX, continued: false });
      doc.text('Category', categoryX, tableTop, { width: dateX - categoryX, continued: false });
      doc.text('Date', dateX, tableTop, { width: noteX - dateX, continued: false });
      doc.text('Note', noteX, tableTop, { width: doc.page.width - noteX - 30, continued: false });
      doc.moveDown(0.5);
      doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(itemX, doc.y).lineTo(doc.page.width - 30, doc.y).stroke();
      doc.moveDown(0.5);
      
      doc.font('Helvetica').fontSize(10);

      // Table Rows
      for (const item of dataToExport) {
        const y = doc.y;
        doc.text(item.Title, itemX, y, { width: amountX - itemX });
        doc.text(item.Amount.toString(), amountX, y, { width: categoryX - amountX });
        doc.text(item.Category, categoryX, y, { width: dateX - categoryX });
        doc.text(item.Date, dateX, y, { width: noteX - dateX });
        doc.text(item.Note, noteX, y, { width: doc.page.width - noteX - 30 });
        doc.moveDown(1.5); // Add some space between rows
        
        // Draw line after each row, except the last one
        if (dataToExport.indexOf(item) < dataToExport.length -1) {
            doc.strokeColor('#dddddd').lineWidth(0.5).moveTo(itemX, doc.y - rowHeight/2).lineTo(doc.page.width - 30, doc.y-rowHeight/2).stroke();
            doc.moveDown(0.5);
        }
      }
      
      doc.end();
      return; // Ensure no other response is sent

    } else {
      return res.status(400).send('Invalid or missing format parameter. Use "csv", "xlsx", or "pdf".');
    }
  } catch (err) {
    console.error('Error exporting expenses:', err);
    return res.status(500).json({
      message: 'Error exporting expenses',
      error: err.message,
    });
  }
};

// Get an expense by ID 
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

// Update an existing expense 
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
