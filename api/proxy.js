// Vercel Serverless Function — CORS Proxy cho Google Apps Script
// CommonJS syntax để Vercel Node.js runtime nhận diện đúng

const GAS_URL = 'https://script.google.com/macros/s/AKfycbylLfGUGxxTOk6S8G4kweo36MNJpiKH7EZ33-dKHTSInd3fq6ZlDPoTQrN-XX38uvQJ/exec';

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let gasResponse;

    if (req.method === 'GET') {
      const action = req.query.action || '';
      gasResponse = await fetch(`${GAS_URL}?action=${action}`, {
        redirect: 'follow'
      });
    } else if (req.method === 'POST') {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const bodyStr = Buffer.concat(chunks).toString();

      gasResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: bodyStr,
        redirect: 'follow'
      });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const text = await gasResponse.text();
    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch {
      // GAS trả về HTML (lỗi deploy) — log để debug
      console.error('[Proxy] GAS returned non-JSON:', text.substring(0, 200));
      return res.status(502).json({ error: 'GAS returned non-JSON', preview: text.substring(0, 200) });
    }
  } catch (error) {
    console.error('[Proxy Error]', error);
    return res.status(500).json({ error: error.message });
  }
};
