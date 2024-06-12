const withTM = require('next-transpile-modules')(['ol']);

module.exports = withTM({
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    });

    return config;
  },
});
