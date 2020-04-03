import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "加载中遮罩",
	props: {
		loading : '加载开启状态 true/false',
		options: {
			loadingText: "加载提示文字",
			shimStyle: "背景遮罩样式"
		}
	},
	methods: {
	},
	events: {
	},
	demos: [demo1]
};
