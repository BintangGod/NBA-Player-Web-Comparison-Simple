export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Extract the path after /api/
  // Example: /api/stats/playerindex -> /stats/playerindex
  const targetPath = url.pathname.replace(/^\/api/, '');
  
  // Construct the target URL for stats.nba.com
  const targetUrl = new URL(`https://stats.nba.com${targetPath}`);
  targetUrl.search = url.search;

  // Clone headers from the incoming request but overwrite the mandatory NBA API headers
  const requestHeaders = new Headers(context.request.headers);
  requestHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  requestHeaders.set('Referer', 'https://www.nba.com/');
  requestHeaders.set('Origin', 'https://www.nba.com');
  requestHeaders.set('Accept', 'application/json, text/plain, */*');
  
  // Host header must be omitted or match the target, fetch handles it automatically.
  requestHeaders.delete('Host');

  try {
    const response = await fetch(targetUrl.toString(), {
      method: context.request.method,
      headers: requestHeaders
    });

    // We must clone the response to modify headers (CORS)
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return newResponse;
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
