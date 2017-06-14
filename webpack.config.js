var webpack = require('webpack');
var path = require("path");

module.exports = {
    //entry: './src/app.js',
    entry: {
        'main':'./src/app.js',
        'vendor': 'jquery'
    },
    output: {
        path: path.resolve(__dirname, 'builds'),
        filename: '[name].js'
    },
    devServer:{
        historyApiFallback:true,
        hot:true,
        inline:true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'], // 指定公共 bundle 的名字。
            minChunks: function (module) {
                // 该配置假定你引入的 vendor 存在于 node_modules 目录中
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        })
        /*new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            }
        })*/
    ]
};