export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);
  
  // Let static assets pass through
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|map|json)$/)) {
    return next();
  }
  
  // For all other routes, serve index.html (SPA routing)
  const response = await env.ASSETS.fetch(new Request(new URL("/index.html", request.url)));
  return new Response(response.body, {
    ...response,
    headers: {
      ...Object.fromEntries(response.headers),
      "Content-Type": "text/html;charset=UTF-8",
    }
  });
}
