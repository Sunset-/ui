import demo1 from "./demo/demo1.vue";

module.exports = {
	title: "日期选择框",
	isFormField: true,
	props: {
		"v-model": "组件值",
		options: {
			type: "类型",
			format:"显示在输入框的格式",
			valueformat:'输出值格式 默认为Date对象 可选值为"timestamp、yyyy-MM-dd"',
			placeholder: "输入提示",
			clearable: "是否显示清空按钮",
			changeCallBack: "回掉函数",
			disabledDate: "设置禁用状态，参数为当前日期，要求返回 Boolean"
		}
	},
	methods: {
	},
	events: {
		change: {
			desc: "日期改变回掉方法",
			args: "value,日期返回值"
		}
	},
	demos: [demo1]
};
