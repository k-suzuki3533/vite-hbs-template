// stylelint.config.cjs
module.exports = {
  overrides: [
    {
      files: ["**/*.scss"],
      customSyntax: "postcss-scss"
    }
  ],
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-recess-order"
  ],
  rules: {
    "selector-class-pattern": null
  },
  ignoreFiles: ["dist/**/*", "node_modules/**/*"]
};
