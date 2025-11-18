const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../store');

const router = express.Router();

// GET /todos
router.get('/', (req, res) => {
  const todos = readData();
  res.json(todos);
});

// POST /todos
router.post('/', (req, res) => {
  const todos = readData();
  const { title, completed = false } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'title is required and must be a string' });
  }
  const todo = { id: uuidv4(), title, completed: !!completed, created_at: new Date().toISOString() };
  todos.push(todo);
  writeData(todos);
  res.status(201).json(todo);
});

// PUT /todos/:id
router.put('/:id', (req, res) => {
  const todos = readData();
  const id = req.params.id;
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'todo not found' });

  const { title, completed } = req.body;
  if (title !== undefined) todos[idx].title = title;
  if (completed !== undefined) todos[idx].completed = !!completed;
  todos[idx].updated_at = new Date().toISOString();

  writeData(todos);
  res.json(todos[idx]);
});

// DELETE /todos/:id
router.delete('/:id', (req, res) => {
  const todos = readData();
  const id = req.params.id;
  const filtered = todos.filter(t => t.id !== id);
  if (filtered.length === todos.length) return res.status(404).json({ error: 'todo not found' });
  writeData(filtered);
  res.status(204).send();
});

module.exports = router;