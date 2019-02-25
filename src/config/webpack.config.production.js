/**
 * 
 * constants
 * 
 */
const MODE = 'production';

/**
 * 
 * required modules
 * 
 */
const path = require('path');
const webpack = require('webpack');

/**
 * 
 * plugins
 * 
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackVisualizerPlugin = require('webpack-visualizer-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");


const paths = require('./paths');
const config = require('./config.js');

/**
 * 
 * Output Webpack Config
 * 
 */
module.exports = {

    mode: MODE,

    entry: ['./source/index'],
    
    output: {
        path: paths.appBuild,
        // user chunk hash to elimilate browser cache
        filename: 'javascript/[name].[hash].bundle.js',
        chunkFilename: 'javascript/[name].[hash].chunk.js',
        publicPath: '/'
    },

    module: {
        rules: [
            {
                exclude: /node_modules|packages/,
                test: /.jsx?$/,
                use: 'babel-loader',
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use:  [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name       : '[sha512:hash:base64:10].[ext]',
                            outputPath : 'images/'
                        }
                    }
                ]
            }
        ]
    },

    plugins: [ 

        // keep vendor bundle unchanged when only module.id was changed, see:
        // https://webpack.js.org/guides/caching/#module-identifiers
        new webpack.HashedModuleIdsPlugin(),

        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            },
        }),

        // extract css files
        new MiniCssExtractPlugin({
            filename: 'stylesheet/[name].[hash].css',
            chunkFilename: 'stylesheet/[id].[hash].css',
        }),

        new webpack.NamedModulesPlugin(),

        new HtmlWebpackPlugin({
            inject   : 'body',
            template : paths.appHtml,
            filename : 'index.html',
            minify: true
        }),

        new HtmlWebpackHarddiskPlugin(),

        new WebpackVisualizerPlugin(),

        // remove all locale files
        // This solution is used in create-react-app.
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        // In this case, you don't need load the locale files in your code.
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-au/),

    ],
    
    resolve: {
        extensions: [ '.js', '.jsx'],
    },
    
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    chunks: 'all',
                    reuseExistingChunk: true,
                    priority: 1,
                    enforce: true,
                    test(module, chunks) {
                        const name = module.nameForCondition && module.nameForCondition();
                        return chunks.some(chunk => {
                            return chunk.name === 'main' && /[\\/]node_modules[\\/]/.test(name);
                        });
                    }
                },
                secondary: {
                    name: 'secondary',
                    chunks: 'all',
                    priority: 2,
                    enforce: true,
                    test(module, chunks) {
                        return chunks.some(chunk => chunk.name === 'secondary');
                    }
                }
            }
        },
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                // set to true if you want JS source maps
                sourceMap: false, 
                // remove comments
                uglifyOptions: {
                    output: {
                        comments: false,
                        beautify: false,
                    },
                    compress: {
                        // remove console log
                        drop_console: true 
                    },
                    warnings: false,
                }
            }),
            new OptimizeCSSAssetsPlugin({})
          ]
    },

    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    }
};