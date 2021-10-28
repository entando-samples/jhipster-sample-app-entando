module.exports = {
  input: [
    'src/**/*.{js,jsx}',
    'src/**/*.spec.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!i18n/**',
    '!**/node_modules/**',
    '!**/test/**',
  ],
  output: './',
  options: {
    func: {
      list: ['i18next.t', 'i18n.t', 't'],
      extensions: ['.js', '.jsx'],
    },
    lngs: ['en', 'it'],
    ns: ['translation'],
    resource: {
      loadPath: 'src/i18n/locales/{{lng}}.json',
      savePath: 'src/i18n/locales/{{lng}}.json',
    },
  },
};
