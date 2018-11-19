var path = require('path');

module.exports = {
    mode: 'development',
    entry: [
        "babel-polyfill",
        "./www/src/main.jsx"
    ],
    output: {
        path: path.join(__dirname, "www/build"),
        publicPath: "build/",
        filename: "build.js"
    },
    module: {
        rules: [
            {test: /\.html$/, loader: "html-loader"},
            {test: /\.styl$/, loader: "style!css!stylus"},
            // {test: /\.jsx$/, exclude: /node_modules/, loader: "babel-loader"},
            {test: /\.css$/, loader: "style-loader!css-loader"},
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                exclude: /images/,  /* dont want svg images from image folder to be included */
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'fonts/',
                            name: '[name][hash].[ext]',
                        },
                    },
                ],
            }
        ]
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    }
};