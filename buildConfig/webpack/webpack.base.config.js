const webpack = require("webpack");
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");

const config = {
	plugins: [new VueLoaderPlugin()],
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: "vue-loader"
			},
			{
				test: /\.js$/,
				exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
				use: "babel-loader"
			},
			{
				test: /\.(gif|jpg|jpeg|png|svg)\??.*$/,
				use: "url-loader?limit=10000&name=./images/[name].[ext]"
			},
			{ test: /\.(eot|woff|ttf)$/, use: "file-loader" }
		]
	},
	resolve: {
		alias: {
			src: path.resolve(__dirname, "../../src"),
			components: path.resolve(__dirname, "../../src/components"),
			style: path.resolve(__dirname, "../../src/style")
		},
		extensions: [".js", ".vue", ".coffee", ".html", ".css", ".scss"]
	}
};

module.exports = config;
