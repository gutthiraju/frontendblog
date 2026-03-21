const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000', // Your local Node.js server
      changeOrigin: true,
      // This ensures '/api/auth/login' reaches backend as '/api/auth/login'
      pathRewrite: {
        '^/api': '/api', 
      },
    })
  );
};