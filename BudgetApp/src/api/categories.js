import client from './client';

export async function fetchCategories(month) {
  const res = await client.get('/categories', { params: { month } });
  return res.data;
}

export async function fetchAllCategories() {
  const res = await client.get('/categories', { params: { all: true } });
  return res.data;
}

export async function createCategory(data) {
  const res = await client.post('/categories', data);
  return res.data;
}

export async function updateCategory(id, data) {
  const res = await client.put(`/categories/${id}`, data);
  return res.data;
}

export async function deleteCategory(id) {
  await client.delete(`/categories/${id}`);
}
