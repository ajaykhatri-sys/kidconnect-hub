export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Serve static assets directly
    const assetExtensions = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map|webp|json|txt|xml)$/;
    if (assetExtensions.test(url.pathname)) {
      return env.ASSETS.fetch(request);
    }
    
    // For all HTML routes, serve index.html (SPA routing)
    const indexUrl = new URL("/index.html", url.origin);
    return env.ASSETS.fetch(new Request(indexUrl, request));
  }
};
