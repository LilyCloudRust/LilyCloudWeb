// vite.config.js
import { defineConfig, loadEnv } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  // Get API domain from env, fallback to localhost:8000
  const apiDomain = env.VITE_API_DOMAIN || "http://8.130.168.243:8000";

  return {
    plugins: [solidPlugin()],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: apiDomain,
          changeOrigin: true,
        },
        "/webdav": {
          target: apiDomain,
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
      historyApiFallback: true,
    },
    build: {
      target: "esnext",
    },
  };
});
