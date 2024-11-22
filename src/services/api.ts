const API_URL = 'http://localhost:3001/api';

export const fetchCustomers = async () => {
  const response = await fetch(`${API_URL}/customers`);
  if (!response.ok) throw new Error('Failed to fetch customers');
  return response.json();
};

export const addCustomer = async (customer: { customer_id: string; name: string }) => {
  const response = await fetch(`${API_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  });
  if (!response.ok) throw new Error('Failed to add customer');
  return response.json();
};

export const updateCustomer = async (customer: { id: number; customer_id: string; name: string }) => {
  const response = await fetch(`${API_URL}/customers/${customer.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  });
  if (!response.ok) throw new Error('Failed to update customer');
  return response.json();
};

export const deleteCustomer = async (id: number) => {
  const response = await fetch(`${API_URL}/customers/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete customer');
};

export const fetchQuestions = async () => {
  const response = await fetch(`${API_URL}/questions`);
  if (!response.ok) throw new Error('Failed to fetch questions');
  return response.json();
};

export const addQuestion = async (questionText: string) => {
  const response = await fetch(`${API_URL}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question_text: questionText }),
  });
  if (!response.ok) throw new Error('Failed to add question');
  return response.json();
};

export const updateQuestion = async (question: { id: number; question_text: string }) => {
  const response = await fetch(`${API_URL}/questions/${question.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question),
  });
  if (!response.ok) throw new Error('Failed to update question');
  return response.json();
};

export const deleteQuestion = async (id: number) => {
  const response = await fetch(`${API_URL}/questions/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete question');
};