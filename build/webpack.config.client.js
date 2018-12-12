const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const isDev = process.env.NODE_ENV;

const config = webpackMerge(baseConfig, {
    entry: {
        app: path.join(__dirname, '../client/app.js')
    },
    output: {
        filename: '[name].[hash].js',
    },
    
    plugins: [
        new HTMLPlugin({
            template: path.join(__dirname, '../client/template.html')
        }),
        new HTMLPlugin({
            template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
            filename: 'server.ejs'
        })
    ]
})

if(isDev) {
    config.devtool = 'cheap-module-eval-source-map'
    config.entry = [
        'babel-polyfill',
        `react-hot-loader/patch`,
        path.join(__dirname, '../client/app.js')
    ]
    config.devServer = {
        host: '0.0.0.0',
        port: '8888',
        // contentBase: path.join(__dirname, '../dist'),
        hot: true,
        overlay: {
            errors: true
        },
        publicPath: '/public/',
        historyApiFallback: {
            index: '/public/index.html'
        },
        proxy: {
            '/api': 'http://localhost:3333'
        }
    }
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
} else {
    config.entry = {
        app: path.join(__dirname, '../client/app.js'),
    }
    config.output.filename = '[name].[chunkhash].js'
    config.optimization = {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: "initial",
                    test: path.resolve(__dirname, "../node_modules"),
                    name: 'vendor',
                    enforce: true,
                }
            }
        }
    }
}

module.exports = config