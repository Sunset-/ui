const webpack = require("webpack");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.config");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = merge(baseConfig, {
	mode: "production",
	entry: {
		"netposa-xui": "./src/np-xui-build.js"
	},
	output: {
		path: path.resolve(__dirname, "../../dist"),
		filename: "[name].js",
		libraryTarget: "umd", // 组件采用UMD格式打包
		library: "netposa-xui"
	},
	// optimization: {
	// 	splitChunks: {
	// 		cacheGroups: {
	// 			commons: {
	// 				test: /[\\/]node_modules[\\/]/,
	// 				name: "vendor",
	// 				chunks: "all"
	// 			}
	// 		}
	// 	}
	// },
	plugins: [
		new MiniCssExtractPlugin({
			filename: "netposa-xui.css"
		})
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							plugins: loader => [require("autoprefixer")()]
						}
					}
				]
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							plugins: loader => [require("autoprefixer")()]
						}
					},
					"sass-loader"
				]
			},
			{
				test: /\.less$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							plugins: loader => [require("autoprefixer")()]
						}
					},
					"less-loader"
				]
			}
		]
	}
});

module.exports = config;
