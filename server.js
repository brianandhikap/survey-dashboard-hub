const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'survey',
  password: 'salatiga2024',
  database: 'survey_db'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Customer endpoints
app.get('/api/customers', (req, res) => {
  db.query('SELECT * FROM customers', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/customers', (req, res) => {
  const { customer_id, name } = req.body;
  db.query(
    'INSERT INTO customers (customer_id, name) VALUES (?, ?)',
    [customer_id, name],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: result.insertId, customer_id, name });
    }
  );
});

app.put('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { customer_id, name } = req.body;
  db.query(
    'UPDATE customers SET customer_id = ?, name = ? WHERE id = ?',
    [customer_id, name, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }
      res.json({ id, customer_id, name });
    }
  );
});

app.delete('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.query('DELETE FROM customers WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(204).send();
  });
});

// Question endpoints
app.get('/api/questions', (req, res) => {
  db.query('SELECT * FROM questions', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/questions', (req, res) => {
  const { question_text } = req.body;
  db.query(
    'INSERT INTO questions (question_text) VALUES (?)',
    [question_text],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: result.insertId, question_text });
    }
  );
});

app.put('/api/questions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { question_text } = req.body;
  db.query(
    'UPDATE questions SET question_text = ? WHERE id = ?',
    [question_text, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Question not found' });
        return;
      }
      res.json({ id, question_text });
    }
  );
});

app.delete('/api/questions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.query('DELETE FROM questions WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(204).send();
  });
});

// Answers endpoint with aggregated data
app.get('/api/answers', (req, res) => {
  const query = `
    SELECT 
      q.question_text,
      a.answer,
      COUNT(*) as count
    FROM answers a
    JOIN questions q ON a.question_id = q.id
    GROUP BY q.question_text, a.answer
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});