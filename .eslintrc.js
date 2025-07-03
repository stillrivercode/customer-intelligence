module.exports = {
  extends: ['./.eslintrc.base.js', 'plugin:security/recommended'],
  overrides: [
    {
      // Disable security rules for test files
      files: [
        '**/*.test.js',
        '**/*.spec.js',
        '**/tests/**/*.js',
        '**/test/**/*.js',
        '**/__tests__/**/*.js',
      ],
      rules: {
        'security/detect-child-process': 'off',
        'security/detect-non-literal-fs-filename': 'off',
        'security/detect-non-literal-require': 'off',
        'security/detect-unsafe-regex': 'off',
      },
    },
  ],
};
