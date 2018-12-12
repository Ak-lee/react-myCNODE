const path = require('path')

const isDev = process.env.NODE_ENV;
const mode = isDev ? 'development' : 'production'

module.exports = {
    output: {
        path: path.join(__dirname, '../dist'),
        publicPath: '/public/',
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    mode: mode,
    module: {
        rules: [
            {
                test: /.jsx$/,
                loader: 'babel-loader'
            },{
                test: /.js$/,
                loader: 'babel-loader',
                exclude: path.join(__dirname, '../node_modules')
            },{
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name]:[ext]?hash'
                }
            }
        ]
    }
}