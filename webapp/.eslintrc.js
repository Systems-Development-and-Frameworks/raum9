module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [],
  // add your custom rules here
  rules: {
    "semi": ["error", "always"],
    "quotes": ["off", "single"],
    "indent": ["off", 4],
    "object-curly-spacing": "off",
    "no-undef": "off",
    "comma-dangle": "off",
    "import/order": "off",
    "vue/html-self-closing": "off",
    "space-before-function-paren": "off",
    "no-multiple-empty-lines": "off",
    "vue/max-attributes-per-line": "off",
    "vue/attributes-order": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/html-closing-bracket-spacing": "off",
    "vue/require-default-prop": "off",
    "vue/require-prop-types": "off",
    "vue/html-closing-bracket-newline": "off",
    "no-unused-vars": "off"
  }
}
