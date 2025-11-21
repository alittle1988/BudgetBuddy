import client from './client';

export async function fetchTransactions(month) {
  const res = await client.get('/transactions', { params: { month } });
  return res.data;
}

export async function createTransaction(data) {
  const res = await client.post('/transactions', data);
  return res.data;
}

export async function deleteTransaction(id) {
  await client.delete(`/transactions/${id}`);
}

export async function updateTransaction(id, data) {
  const res = await client.put(`/transactions/${id}`, data);
  return res.data;
}
