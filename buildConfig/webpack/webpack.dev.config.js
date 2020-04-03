const webpack = require("webpack");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.config");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = merge(baseConfig, {
	mode: "development",
	//入口
	entry: ["webpack/hot/only-dev-server", path.resolve(__dirname, "../../src/main.js")],
	//出口
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "../../build")
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "../../src/index.html"),
			hash: true // 会在打包好的bundle.js后面加上hash串
		}),
		new webpack.HotModuleReplacementPlugin()
	],
	devServer: require("./devServer"),
	resolve: {
		alias: {
			vue: "vue/dist/vue.js",
			jquery: "jquery/dist/jquery.min.js"
		}
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["vue-style-loader", "css-loader"]
			},
			{
				test: /\.scss$/,
				use: ["vue-style-loader", "css-loader", "postcss-loader", "sass-loader"]
			},
			{
				test: /\.less$/,
				use: ["vue-style-loader", "css-loader", "postcss-loader", "less-loader"]
			}
		]
	}
});

module.exports = config;
