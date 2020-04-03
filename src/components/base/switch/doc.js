import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "开关",
	isFormField: true,
	props: {
		"v-model": "组件值",
		options: {
			disabled: "<i class='vt' >Boolean</i>是否禁用",
			animate: "<i class='vt' >Boolean</i>动画，默认true",
			size: "<i class='vt' >String</i>尺寸:big,small,mini",
			ctx: "<i class='vt' >String</i>尺寸:big,small,mini"
		}
	},
	methods: {},
	events: {
		change: {
			desc: "值变更事件",
			args: "v - 当前值 , options - 配置对象 , reset(rv) - 重置函数，用于操作失败后回退开关"
		}
	},
	demos: [demo1]
};
