// src/api/client.js
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Attach JWT token if present (sessionStorage first, then localStorage)
client.interceptors.request.use((config) => {
  const sessionToken = sessionStorage.getItem('token');
  const localToken = localStorage.getItem('token');
  const token = sessionToken || localToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
