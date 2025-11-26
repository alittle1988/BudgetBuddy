// src/api/user.js
import client from './client';

export async function fetchUserProfile() {
  const res = await client.get('/users/me');
  return res.data;
}

export async function updateUserProfile(payload) {
  const res = await client.put('/users/me', payload);
  return res.data;
}

export async function changePassword(payload) {
  const res = await client.post('/users/change-password', payload);
  return res.data;
}
