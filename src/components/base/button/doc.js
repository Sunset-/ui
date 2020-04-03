import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "按钮",
	isFormField: false,
	desc: "提供语义化的按钮配置,同时支持Options和展开的props配置",
	slot: {
		default: "按钮文本，会覆盖label属性配置"
	},
	props: {
		label: "<i class='vt' >String</i>按钮文本",
		icon: "<i class='vt' >String</i>按钮图标",
		color: "<i class='vt' >String</i>语义颜色:primary,success,warning,danger,info,text",
		size: "<i class='vt' >String</i>尺寸:medium,small,mini",
		disabled: "<i class='vt' >Boolean</i>是否禁用",
		options: "<i class='vt' >Object</i>可将上述属性组合成一个对象传入",
		isStopBubble:"<i class='vt' >Boolean</i>是否阻止冒泡"
	},
	methods: {},
	events: {
		click: {
			desc: "点击事件",
			args: "无"
		}
	},
	demos: [demo1]
};
