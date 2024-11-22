const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Sample data (replace with your database)
let customers = [
  { id: 1, customer_id: "CUST001", name: "John Doe" },
  { id: 2, customer_id: "CUST002", name: "Jane Smith" }
];

let questions = [
  { id: 1, question_text: "How satisfied are you with our service?" },
  { id: 2, question_text: "Would you recommend us to others?" }
];

let answers = [
  { question_text: "How satisfied are you with our service?", count: 10, answer: "Very Satisfied" },
  { question_text: "Would you recommend us to others?", count: 8, answer: "Yes" }
];

// Customer endpoints
app.get('/api/customers', (req, res) => {
  res.json(customers);
});

app.post('/api/customers', (req, res) => {
  const newCustomer = {
    id: customers.length + 1,
    ...req.body
  };
  customers.push(newCustomer);
  res.status(201).json(newCustomer);
});

app.put('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = customers.findIndex(c => c.id === id);
  if (index !== -1) {
    customers[index] = { ...customers[index], ...req.body };
    res.json(customers[index]);
  } else {
    res.status(404).json({ error: 'Customer not found' });
  }
});

app.delete('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  customers = customers.filter(c => c.id !== id);
  res.status(204).send();
});

// Question endpoints
app.get('/api/questions', (req, res) => {
  res.json(questions);
});

app.post('/api/questions', (req, res) => {
  const newQuestion = {
    id: questions.length + 1,
    ...req.body
  };
  questions.push(newQuestion);
  res.status(201).json(newQuestion);
});

app.put('/api/questions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = questions.findIndex(q => q.id === id);
  if (index !== -1) {
    questions[index] = { ...questions[index], ...req.body };
    res.json(questions[index]);
  } else {
    res.status(404).json({ error: 'Question not found' });
  }
});

app.delete('/api/questions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  questions = questions.filter(q => q.id !== id);
  res.status(204).send();
});

// Answers endpoint
app.get('/api/answers', (req, res) => {
  res.json(answers);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});