// Documentation for this file: https://prettier.io/en/configuration.html
module.exports = {
  // We use a larger print width because Prettier's word-wrapping seems to be tuned
  // for plain JavaScript without type annotations
  printWidth: 160,

  // Use .gitattributes to manage newlines
  endOfLine: "auto",

  // Use single quotes instead of double quotes
  singleQuote: false,

  quoteProps: "as-needed",
  semi: true,
  useTabs: false,
  tabWidth: 2,
  jsxSingleQuote: false,
  bracketSpacing: true,
  arrowParens: "always",
  // For ES5, trailing commas cannot be used in function parameters; it is counterintuitive
  // to use them for arrays only
  trailingComma: "es5",
};
