const mongoose = require('mongoose');
const Todo = require('../models/Todo');

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

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, description, status, dueDate },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

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