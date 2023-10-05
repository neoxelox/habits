module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-standard-scss",
    "stylelint-config-prettier",
    "stylelint-config-html",
  ],
  plugins: ["stylelint-scss", "stylelint-order"],
  rules: {
    "scss/at-rule-no-unknown": [true, { ignoreAtRules: ["tailwind", "apply", "variants", "responsive", "screen"] }],
    "function-no-unknown": [true, { ignoreFunctions: ["theme"] }],
    "color-hex-length": "long",
  },
};
