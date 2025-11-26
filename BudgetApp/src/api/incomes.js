import client from './client';

export async function fetchIncomes(month) {
  const res = await client.get('/incomes', { params: { month } });
  return res.data;
}

export async function createIncome(data) {
  const res = await client.post('/incomes', data);
  return res.data;
}

export async function updateIncome(id, data) {
  const res = await client.put(`/incomes/${id}`, data);
  return res.data;
}

export async function deleteIncome(id) {
  await client.delete(`/incomes/${id}`);
}
