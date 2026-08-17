// Vercel Serverless Function — CORS Proxy cho Google Apps Script
// Frontend gọi /api/proxy thay vì gọi GAS trực tiếp để tránh CORS

const GAS_URL = 'https://script.google.com/macros/s/AKfycbylLfGUGxxTOk6S8G4kweo36MNJpiKH7EZ33-dKHTSInd3fq6ZlDPoTQrN-XX38uvQJ/exec';

export default async function handler(req, res) {
  // CORS headers để frontend gọi được
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Xử lý preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let gasResponse;

    if (req.method === 'GET') {
      const action = req.query.action || '';
      gasResponse = await fetch(`${GAS_URL}?action=${action}`, {
        method: 'GET',
        redirect: 'follow'
      });
    } else if (req.method === 'POST') {
      // Đọc body từ request
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
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

    // Cố parse JSON, nếu lỗi trả về text thô
    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch {
      return res.status(200).send(text);
    }

  } catch (error) {
    console.error('[Proxy Error]', error);
    return res.status(500).json({ error: error.message });
  }
}
