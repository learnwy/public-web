require("@learnwy/eslint-config/patch/modern-module-resolution");

module.exports = {
  extends: ["@learnwy/eslint-config/profile/node"],
  parserOptions: { tsconfigRootDir: __dirname },
  overrides: [
    {
      files: ["*.ts"],
      rules: {
        "no-empty-function": ["error", { allow: ["arrowFunctions"] }],
      },
    },
  ],
};
