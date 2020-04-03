const webpack = require("webpack");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.build.config");

const config = merge(baseConfig, {
	output: {
		libraryTarget: "commonjs2" // 组件采用UMD格式打包
	}
});

module.exports = config;
