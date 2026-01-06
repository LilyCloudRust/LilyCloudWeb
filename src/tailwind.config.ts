// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  // 关键：content 必须包含所有 src 下的文件，否则样式不会生效
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // 可以在这里扩展颜色或字体，目前保持默认即可
      colors: {
        // 如果想自定义主色调，可以在这里加，例如：
        // brand: '#2563EB',
      },
    },
  },
  plugins: [],
};

export default config;
