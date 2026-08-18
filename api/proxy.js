// vercel/api/proxy.js
// GAS APIへの中継（CORSを回避）

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { action, sku } = req.query;
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbwQbOYyybOwIn9T-K4nig_HqHEW-p192ywFbYvXSBdADez-52i97Yt_37G71BwO4IK9/exec';

  try {
    let url = `${GAS_URL}?action=${action}`;
    if (sku) url += `&sku=${encodeURIComponent(sku)}`;

    const response = await fetch(url, { redirect: 'follow' });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
