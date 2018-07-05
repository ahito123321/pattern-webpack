//basis module
const path = require('path');
const webpack = require('webpack');


//plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const ImageMinPlugin = require('image-min-plugin').default;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

//main config
module.exports = (env, options) => {
    const isDevelopment = options.mode === 'development';
    const isProduction = !isDevelopment;

    let conf = {

        //point in
        entry: {
            //main file app
            app: [
                path.resolve(__dirname, 'src', 'js', 'app.jsx'),
                path.resolve(__dirname, 'src', 'scss', 'style.scss') 
            ]
        },

        //path output files
        output:{
            filename: 'js/[name].js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: "dist/"
        },

        //config webpack-dev-server
        devServer: {
            overlay: true
        },

        devtool: (isDevelopment) ? 'source-map' : '',

        //modules
        module: {
            rules:[
                //js
                {
                    test: /\.jsx?$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options:{
                                sourceMap: true
                            }
                        }
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
                                root: '.',
                                minimize: isProduction,
                                sourceMap: isDevelopment
                            }
                        },
                        'postcss-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDevelopment
                            }
                        }
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
                                name: '[path]/[name].[ext]'
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
                filename: 'css/style.css'
            }),
            new CopyWebpackPlugin(
                [
                    {
                        from: path.resolve(__dirname, 'src', 'img'), 
                        to: 'img'
                    },
                    {
                        from: path.resolve(__dirname, 'src', 'fonts'), 
                        to: 'fonts'
                    }
                ],
                {
                    ignore: [
                        {
                            glob: path.resolve(__dirname, 'src', 'svg', '*')
                        }
                    ]
                }
            )
        ]
    };
    //isProduction
    if (isProduction){
        conf.plugins.push(
            new HtmlWebpackPlugin(
                {
                    filename: 'index.html',
                    inject: false,
                    hash: true,
                    template: path.resolve(__dirname, 'src', 'index.html'),
                    minify:{
                        removeComments: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true
                    }
                }
            )
        );
        conf.plugins.push(
            new CleanWebpackPlugin(['dist'])
        );
        conf.plugins.push(
            new UglifyjsWebpackPlugin({
                sourceMap: true
            })
        );
        conf.plugins.push(
            new ImageMinPlugin({
                test: /\.(png|gif|jpe?g|svg)$/
            })
        );
    }
    return conf;
}