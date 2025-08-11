const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory data
let users = [];
let attendance = [];

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Users
app.get('/users', (req, res) => res.json(users));
app.post('/users', (req, res) => {
  const user = { id: uuidv4(), ...req.body };
  users.push(user);
  res.json(user);
});

// Attendance
app.get('/attendance', (req, res) => res.json(attendance));
app.post('/attendance/checkin', (req, res) => {
  const entry = { id: uuidv4(), checkinAt: Date.now(), checkoutAt: null, ...req.body };
  attendance.push(entry);
  res.json(entry);
});
app.post('/attendance/checkout', (req, res) => {
  const entry = attendance.find(e => e.userId === req.body.userId && !e.checkoutAt);
  if (entry) entry.checkoutAt = Date.now();
  res.json(entry || {});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
