module.exports = {
  'extends': '@ridi',
  'globals': {
    'jQuery': true,
    '$': true,
    'React': true,
    'ReactDOM': true,
    'ContentInfo': true,
    'EpisodeInfo': true,
    'EtcInfo': true,
    'PageInitialize': true,
    'jwplayer': true,
    'AndroidBridge': true,
    'CommonConfig': true,
    'IMP': true,
  },
  'env': {
    'browser': true,
    'node': true,
  },
  'rules': {
    'import/prefer-default-export': 0,
    'react/require-default-props': 0,
    'react/forbid-prop-types': 0,
  },
};
