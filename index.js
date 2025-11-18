const express = require('express');
const bodyParser = require('express').json;
const path = require('path');
const todosRouter = require('./routes/todos');

const app = express();
app.use(bodyParser());

// Serve static frontend from /public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Simple TODO API. See /todos or open the frontend.');
});

app.use('/todos', todosRouter);

// Simple error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TODO API listening on http://localhost:${PORT}`);
});