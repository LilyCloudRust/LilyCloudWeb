import js from "@eslint/js";
import * as tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import solidPlugin from "eslint-plugin-solid";
import solid from "eslint-plugin-solid/configs/typescript";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    ...solid,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "tsconfig.json",
      },
    },
    plugins: {
      solid: solidPlugin,
      import: importPlugin,
      importSort: simpleImportSort,
    },
    rules: {
      "importSort/imports": "error",
      "importSort/exports": "error",
    },
  },
];
