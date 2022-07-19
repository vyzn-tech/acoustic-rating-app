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
      name: 'app1',
      filename: 'remoteEntry.js',
      library: {type: 'var', name: 'app1'},
      exposes: {
        './web-components': './src/app.js',
        './remoteApp': './src/remoteApp',
      },
      shared: {},
    }),
  ];

  return config;
});