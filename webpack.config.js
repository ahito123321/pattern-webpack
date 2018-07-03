//basis module
const path = require('path');
const webpack = require('webpack');


//plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const ImageMinPlugin = require('image-min-plugin').default;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const argv = require('yargs').argv;

const isDevelopment = argv.mode === 'development';
const isProduction = !isDevelopment;

//main config
module.exports = {
    //context way 
    context: path.resolve(__dirname, 'src'),
    
    //point in
    entry: {
        //main file app
        app: [
            './js/app.jsx',
            './scss/style.scss'
        ],
    },

    //path output files
    output:{
        filename: './js/[name].js',
        path: path.resolve(__dirname, 'app'),
        publicPath: '../'
    },

    //config webpack-dev-server
    devServer: {
        contentBase: './app'
    },

    devtool: (isDevelopment) ? 'inline-source-map' : '',

    //modules
    module: {
        rules:[
            //js
            {
                test: /\.jsx?$/,
                use: [
                    'babel-loader'
                ]
            },
            //styles
            {
                test: /\.(sc|c|sa)ss$/,
                use: [
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: isProduction
                        }
                    },
                    'postcss-loader',
                    'sass-loader',
                    'resolve-url-loader'
                ]
            },
            //images
            {
                test: /\.(png|gif|jpe?g)$/,
                loader:[
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]'
                        }
                    },
                    'img-loader'
                ]
            },
            //fonts
            {
                test: /\.(woff|woof2|eot|ttf|otf)$/,
                loader:[
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]'
                        }
                    }
                ]  
            },
            //SVG converter
            {
                test: /\.svg$/,
                loader: 'svg-url-loader'
            }
        ]
    },

    //plugins
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'JQuery': 'jquery',
            'jquery': 'jquery'
        }),
        new MiniCssExtractPlugin({
          filename: './css/[name].css'
        }),
        new CopyWebpackPlugin(
            [
                {
                    from: './img', 
                    to: 'img'
                }
            ],
            {
                ignore: [
                    {
                        glob: './svg/*'
                    }
                ]
            }
        )
    ],
}

//isProduction
if (isProduction){
    module.exports.plugins.push(
        new HtmlWebpackPlugin()
    );
    module.exports.plugins.push(
        new CleanWebpackPlugin(['dist'])
    );
    module.exports.plugins.push(
        new UglifyjsWebpackPlugin({
            sourceMap: true
        })
    );
    module.exports.plugins.push(
        new ImageMinPlugin({
            test: /\.(png|gif|jpe?g|svg)$/
        })
    );

}
