const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');

module.exports = () => {
  return {
    mode: 'production',
    entry: {
      'MessageNewHeads': './src/lambdas/message-new-heads.ts'
    },
    // Output each lambda as it's own directory with it's own index.js file, also called a bundle, in the dist/lambdas directory
    output: {
      filename: './[name]/index.js',
      path: path.resolve(__dirname, 'dist/lambdas')
    },
    target: 'node',
    plugins: [
      // Outputs a stats page that shows bundle sizes and dependencies at dist/bundle-stats.html. View it in a browser.
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: '../bunde-stats.html',
        openAnalyzer: false
      })
    ],
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                // Specifically use the below config file when compile typescript
                configFile: 'tsconfig-lambdas.json'
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        // To avoid blotting up the `bn.js` library all over the packages 
        // use single library instance. 
        "bn.js": path.resolve(__dirname, 'node_modules/bn.js')
      }
    },
    externals: {
      // We don't want to include aws-sdk in our bundles since AWS will include it for us
      'aws-sdk': 'commonjs aws-sdk'
    }
  };
}