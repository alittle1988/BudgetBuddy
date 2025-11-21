import client from './client';

export async function fetchNetWorth() {
  const res = await client.get('/net-worth');
  return res.data;
}
