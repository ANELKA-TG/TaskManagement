require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/todos', require('./routes/todos'));

app.get('/', (req, res) => {
  res.json({ message: 'Todo API is running' });
});

const PORT = process.env.PORT || 5000;

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });

