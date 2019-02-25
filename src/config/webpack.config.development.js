/**
 * 
 * constants
 * 
 */
const MODE = 'development';

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
    
    devServer: {
        inline: true,
        hot: true,
        port: config.port,
        // return app bundle at any request
        historyApiFallback: true,
        // static content base path
        contentBase: path.join(__dirname, '..', 'public'),
        proxy   : {
            "/api": config.proxy
        },
        disableHostCheck: true
    },

    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
    },

    module: {
        rules: [
            {
                exclude: /node_modules|packages/,
                test: /.jsx?$/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                use:  [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use:  [
                    'style-loader',
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

        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            },
        }),

        new webpack.NamedModulesPlugin(),

        new HtmlWebpackPlugin({
            inject   : 'body',
            template : paths.appHtml,
            filename : 'index.html',
        })
        
    ],
    
    resolve: {
        extensions: [ '.js', '.jsx'],
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