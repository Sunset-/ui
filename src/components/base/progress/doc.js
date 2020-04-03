import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "进度条",
	accendant: "亮亮",
	isFormField: true,
	slot: {
		default: "进度条内容,插槽作用域（progress:当前进度）"
	},
	props: {
		manner: "<i class='vt' >String</i>风格（line,circle）默认line",
		value: "<i class='vt' >Number</i>当前进度值",
		total: "<i class='vt' >Number</i>总进度值默认100",
		animate: "<i class='vt' >Boolean</i>是否开启动画，默认开启",
		color: "<i class='vt' >String / Function</i>进度条颜色，语义值primary,success,danger,warning,颜色值，函数",
		radius: "<i class='vt' >Number</i>【圆环】圆环半径",
		lineWidth: "<i class='vt' >Number</i>【圆环】圆环宽度",
		backgroundColor: "<i class='vt' >String</i>【圆环】圆环背景色",
		start: "<i class='vt' >String</i>【圆环】圆环进度开始位置:top,left,right,bottom",
		options: "<i class='vt' >Object</i>包含上述值"
	},
	methods: {},
	events: {},
	demos: [demo1]
};
