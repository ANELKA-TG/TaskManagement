const mongoose = require('mongoose');
const Todo = require('../models/Todo');

const DESCRIPTION_MAX = 200;

const startOfDayUTC = (date) =>
  new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );

// Returns an error message, or null if the due date is fine
const checkDueDate = (dueDate, creationDate) => {
  if (!dueDate) return null; // empty means "no due date"

  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return 'Invalid due date';

  if (startOfDayUTC(due) < startOfDayUTC(creationDate)) {
    return 'Due date cannot be before the creation date';
  }

  return null;
};

const serverError = (res) =>
  res.status(500).json({ message: 'Something went wrong. Please try again.' });

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/todos
const createTodo = async (req, res) => {

  try {
    const { title, description, status, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Todo title is required' });
    }

    const todo = await Todo.create({
      title,
      description,
      status,
      dueDate,
      user: req.user._id,
    });

    res.status(201).json(todo);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    serverError(res);
  }

  if (description && description.length > DESCRIPTION_MAX) {
  return res.status(400).json({
    message: `Description cannot exceed ${DESCRIPTION_MAX} characters`,
  });
  const dueDateError = checkDueDate(dueDate, new Date());
if (dueDateError) {
  return res.status(400).json({ message: dueDateError });
}
}

};

// GET /api/todos
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(todos);
  } catch (error) {
    serverError(res);
  }
};

// GET /api/todos/:id
const getTodo = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    serverError(res);
  }
};

// PUT /api/todos/:id
const updateTodo = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const { title, description, status, dueDate } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: 'Todo title is required' });
    }

    if (description && description.length > DESCRIPTION_MAX) {
      return res.status(400).json({
        message: `Description cannot exceed ${DESCRIPTION_MAX} characters`,
      });
    }

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Completed todos can't be edited (only reopened by changing the status)
    const isEditingContent =
      title !== undefined || description !== undefined || dueDate !== undefined;

    if (todo.status === 'completed' && isEditingContent) {
      return res.status(400).json({
        message: 'Completed todos cannot be edited. Mark it as pending first.',
      });
    }

    // The deadline can't be before the todo's creation date
    const dueDateError = checkDueDate(dueDate, todo.createdAt);
    if (dueDateError) {
      return res.status(400).json({ message: dueDateError });
    }

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (status !== undefined) todo.status = status;
    if (dueDate !== undefined) todo.dueDate = dueDate;

    await todo.save();
    res.json(todo);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    serverError(res);
  }
};

// DELETE /api/todos/:id
const deleteTodo = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    serverError(res);
  }
};

module.exports = { createTodo, getTodos, getTodo, updateTodo, deleteTodo };