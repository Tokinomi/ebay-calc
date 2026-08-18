// api/proxy.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const action = req.query.action || '';
  const sku    = req.query.sku || '';
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbwQbOYyybOwIn9T-K4nig_HqHEW-p192ywFbYvXSBdADez-52i97Yt_37G71BwO4IK9/exec';

  // URLを明示的に組み立て
  const params = new URLSearchParams({ action });
  if (sku) params.append('sku', sku);
  const url = `${GAS_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'Accept': 'application/json' }
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      res.status(200).json(data);
    } catch(e) {
      res.status(500).json({ error: 'Non-JSON response', preview: text.substring(0, 300) });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
