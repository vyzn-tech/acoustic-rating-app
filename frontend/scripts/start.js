const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/start.js');
const webpackConfig = require('react-scripts/config/webpack.config');
const { ModuleFederationPlugin } = require('webpack').container;

//In order to override the webpack configuration without ejecting the create-react-app
defaults.__set__('configFactory', (webpackEnv) => {
  let config = webpackConfig(webpackEnv);

  config.optimization.splitChunks = false;
  config.output.publicPath = 'auto';

  //Customize the webpack configuration here.

  // config.resolve.fallback = {
  //   ...config.resolve.fallback,
  // };

  config.plugins = [
    ...config.plugins,
    new ModuleFederationPlugin({
      name: 'acousticRating',
      filename: 'remoteEntry.js',
      exposes: {
        './web-component': './src/app.js',
        './remote-app': './src/remote-app',
        './config': './src/app.config.ts',
      },
      shared: {},
    }),
  ];

  return config;
});