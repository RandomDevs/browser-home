module.exports = {
  'env': {
    'browser': true,
    'es6': true
  },
  'extends': 'airbnb-base',
  'globals': {
      'Atomics': 'readonly',
      'SharedArrayBuffer': 'readonly',
      'browser': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'rules': {
    'arrow-parens': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-as-default-member': 'off',
    'import/prefer-default-export': 'off',
    'max-len': ['error', { 'code': 150 }],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-restricted-syntax': 'off',
    'no-trailing-spaces': 'off',
    'no-use-before-define': 'off',
    'object-curly-newline': 'off',
    'padded-blocks': 'off',
    'react/destructuring-assignment': 'off',
    'react/forbid-prop-types': 'off',
    'semi': [2, 'never'],
  }
}
