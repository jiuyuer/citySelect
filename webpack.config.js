var webpack = require('webpack');
var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var plugins = [
    new ExtractTextPlugin('area.css')
];

module.exports = {
    entry: {
        'area': './src/area.js'
    },
    output: {
        path: path.resolve(__dirname, 'builds'),
        filename: '[name].js'
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true
    },
    externals: {
        jquery: 'jQuery'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader'
                })
            }
        ]
    },
    plugins: plugins
};