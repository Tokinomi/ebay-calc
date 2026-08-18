// api/proxy.js
// GAS APIへの中継（CORSを回避）

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action, sku } = req.query;
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbwQbOYyybOwIn9T-K4nig_HqHEW-p192ywFbYvXSBdADez-52i97Yt_37G71BwO4IK9/exec';

  try {
    let url = `${GAS_URL}?action=${action}`;
    if (sku) url += `&sku=${encodeURIComponent(sku)}`;

    // リダイレクトを手動で追跡
    let response = await fetch(url, { redirect: 'follow' });
    
    // レスポンスのContent-Typeを確認
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const data = await response.json();
      res.status(200).json(data);
    } else {
      // HTMLが返ってきた場合はテキストとして取得してデバッグ
      const text = await response.text();
      // JSONとして解析を試みる
      try {
        const data = JSON.parse(text);
        res.status(200).json(data);
      } catch(e) {
        res.status(500).json({ error: 'GAS returned non-JSON', preview: text.substring(0, 200) });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
