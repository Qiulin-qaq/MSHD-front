const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        port: 8081,
        proxy: {
          '/api': {
              target: 'http://localhost:8888',
              changeOrigin: true,
              ws: true,
              pathRewrite: { 
                rewrite: (path) => path.replace(/^\/api/, ''),
              }
                    
          }
      }
    }
});