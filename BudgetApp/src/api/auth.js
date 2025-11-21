// src/api/auth.js
import client from './client';

export async function registerUser({ email, password, name }) {
  const res = await client.post('/auth/register', { email, password, name });
  return res.data; // { token, user }
}

export async function loginUser({ email, password }) {
  const res = await client.post('/auth/login', { email, password });
  return res.data; // { token, user }
}
