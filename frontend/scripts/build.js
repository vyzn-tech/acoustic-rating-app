const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const { ModuleFederationPlugin } = require('webpack').container;

//In order to override the webpack configuration without ejecting the create-react-app
const config = defaults.__get__('config');
config.optimization.splitChunks = false;

//Customize the webpack configuration here.
// config.resolve.fallback = {
//   ...config.resolve.fallback,
// };

config.plugins = [
  ...config.plugins,
  new ModuleFederationPlugin({
    name: 'app1',
    filename: 'remoteEntry.js',
    // library: {type: 'module', name: 'app1'},
    exposes: {
      './App': './src/App',
    },
    shared: {react: {singleton: true, eager: true}, 'react-dom': {singleton: true, eager: true}},
  }),

];
