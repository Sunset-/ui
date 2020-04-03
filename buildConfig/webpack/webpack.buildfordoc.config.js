const webpack = require("webpack");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.build.config");
const path = require("path");

const config = merge(baseConfig, {
	entry: {
		"netposa-xui": "./src/np-xui-build-doc.js"
	},
	output: {
		path: path.resolve(__dirname, "../../dist"),
		filename: "[name].js"
		// libraryTarget: "amd" // 组件采用UMD格式打包
		// library: "netposa-xui"
	}
});

module.exports = config;
