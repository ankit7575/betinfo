import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import babelParser from "@babel/eslint-parser";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],

    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        requireConfigFile: false,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        jest: "readonly",  // Add jest global for test files
      },
    },

    plugins: { react: pluginReact },

    settings: {
      react: { version: "detect" },
    },

    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      "react/prop-types": "off", // Disable prop-types validation
      "no-console": "off",  // Disable no-console rule
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  {
    ignores: ["node_modules/**", "dist/**", "build/**"],
  },
];