module.exports = {
  "extends": "airbnb",
  "globals": {
    "jQuery": true,
    "$": true,
    "React": true,
    "ReactDOM": true,
    "ContentInfo": true,
    "EpisodeInfo": true,
    "EtcInfo": true,
    "PageInitialize": true,
    "jwplayer": true,
    "AndroidBridge": true,
    "CommonConfig": true,
    "IMP": true,
  },
  "rules": {
    // RIDI style guide
    "class-methods-use-this": 0,
    "comma-dangle": 0,
    "max-len": [1, 140],
    "no-underscore-dangle": 0,
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],

    // Allow in RIDI Story
    "jsx-a11y/no-static-element-interactions": 0,
    "arrow-parens": ["error", "as-needed"],
    "import/prefer-default-export": 0, // 상수 추가시 관리하기 어렵다.


    // 빌드만 되도록 추가한 예외 룰 (TODO: 하나씩 확인하고 정리해주세요!)
    "import/extensions": [0, 'always', {}],
    "import/no-unresolved": 0,
    "camelcase": 0,
    "no-unused-vars": 0,
    "react/forbid-prop-types": 0,

    // Redux
    "global-require": 0, // configureStore작성시에 module.export가 필요해서 품
    "import/no-extraneous-dependencies": 0, // devDependence에 있어도 임포트가능 devTools때문에 품

    //todo delete
    "quote-props": 0,
    "quotes": 0,
    "no-useless-escape": 0,
    "max-len": [0, 140],

  },
  "env": {
    "browser": true,
    "node": true
  }
};
