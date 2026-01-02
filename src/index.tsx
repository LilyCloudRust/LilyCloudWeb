// src/index.tsx
/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css"; // 确保这里引入了 Tailwind 指令
import App from "./App";

const root = document.getElementById("root");

if (root instanceof HTMLElement) {
  render(() => <App />, root);
}
