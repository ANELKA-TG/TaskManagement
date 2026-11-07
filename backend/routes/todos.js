const express = require('express');
const {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todoController');
const protect = require('../middleware/auth');

const router = express.Router();

router.use(protect); // every todo route requires login

router.route('/').get(getTodos).post(createTodo);
router
  .route('/:id')
  .get(getTodo)
  .put(updateTodo)
  .delete(deleteTodo);

module.exports = router;