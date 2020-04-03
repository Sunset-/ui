import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "复选框",
	isFormField: true,
	props: {
		"v-model": "组件值",
		options: {
			type: "单选样式，圆点或按钮（button）",
			size: "尺寸（medium / small / mini）",
			disabled: "是否禁用",
			enum: "枚举字典类型",
			data: "枚举项，数组[{text : text1},{value : value1}]或对象{value1 : text1}",
			errorHandle: "错误回调"
		}
	},
	methods: {},
	events: {
		change: {
			desc: "值变更",
			args: "当前值value"
		}
	},
	demos: [demo1]
};
