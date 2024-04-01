module.exports = {
   root: true,
   env: { browser: true, es2020: true },
   extends: [
      "eslint:recommended",
      "plugin:vue/vue3-recommended",
      "prettier",
   ],
   ignorePatterns: ["dist", ".eslintrc.cjs"],
   parserOptions: { ecmaVersion: "latest", sourceType: "module" },
   settings: { react: { version: "18.2" } },
   plugins: [],
   rules: {
   },
};
