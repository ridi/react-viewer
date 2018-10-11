module.exports = {
  'extends': '@ridi',
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true,
      'modules': true,
      'experimentalObjectRestSpread': true
    }
  },
  'env': {
    'browser': true,
    'node': true,
  },
  'rules': {
    'import/prefer-default-export': 0,
    'react/require-default-props': 0,
    'react/forbid-prop-types': 0,
    'no-underscore-dangle': 0,
    'react/destructuring-assignment': 0,
  },
};
