// Relais Siam Studio → Pruna (Cloudflare Worker, gratuit)
// Il transmet les demandes du site à api.pruna.ai et ajoute l'autorisation « CORS ».
// Il ne parle QU'À api.pruna.ai : ce n'est pas un proxy ouvert.
export default {
  async fetch(request) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Expose-Headers': '*',
      'Access-Control-Max-Age': '86400'
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    const url = new URL(request.url);
    if (url.pathname === '/' || url.pathname === '') {
      return new Response('Relais Siam Studio OK', { headers: cors });
    }
    const target = 'https://api.pruna.ai' + url.pathname + url.search;
    const headers = new Headers(request.headers);
    ['host', 'origin', 'referer', 'cf-connecting-ip', 'x-forwarded-for', 'x-real-ip'].forEach((h) => headers.delete(h));
    const init = { method: request.method, headers, redirect: 'follow' };
    if (request.method !== 'GET' && request.method !== 'HEAD') init.body = await request.arrayBuffer();
    const upstream = await fetch(target, init);
    const response = new Response(upstream.body, upstream);
    Object.entries(cors).forEach(([k, v]) => response.headers.set(k, v));
    return response;
  }
};
