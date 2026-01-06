// vite.config.js
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/webdav": {
        target: "http://localhost:8000",
        changeOrigin: true,

        // 🟢 最终修复：在 JavaScript 文件中使用 onProxyReq
        // 因为这是 .js 文件，TypeScript 不会再报错
        onProxyReq(proxyReq, req, res) {
          // 从浏览器过来的原始请求中读取 authorization 头
          const authHeader = req.headers.authorization;

          // 如果头存在，就把它设置到即将发往后端的代理请求上
          if (authHeader) {
            proxyReq.setHeader("Authorization", authHeader);
            // console.log('[WebDAV Proxy] Forwarding with Authorization header.');
          }
        },
      },
    },
  },
  build: {
    target: "esnext",
  },
});
